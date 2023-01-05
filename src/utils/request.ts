/* eslint-disable no-case-declarations */
import { extend } from "umi-request";
import type {
  ResponseError,
  RequestMethod,
  RequestOptionsInit,
} from "umi-request";
import { notification } from "ant-design-vue";

const codeMessage: Record<number, string> = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};
/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: "您的网络发生异常，无法连接服务器",
      message: "网络异常",
    });
  }
  throw error;
};
/**
 * 配置request请求时的默认参数
 */
export const request: RequestMethod = extend({
  errorHandler,
  prefix: "http://192.169.7.200:8070",
});

const { interceptors } = request;
/**
 * request 请求前处理
 */
interceptors.request.use(
  (url, options) => {
    return {
      url,
      options: { ...options, interceptors: true },
    };
  },
  { global: false }
);

/**
 * response-对请求返回后的处理
 */

interceptors.response.use(async (response: Response, opt) => {
  let res: any;
  try {
    res = await response.clone().json();
  } catch (error) {
    const { responseType } = opt;
    switch (responseType) {
      case "blob":
        const disposition = response.headers.get("content-disposition");
        const filename = disposition
          ? decodeURI(disposition.split(";")[1].split("filename=")[1])
          : "";
        const blob = await response.clone().blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a); // append the element to the dom
        a.click();
        a.remove(); // afterwards, remove the element
        break;

      default:
        break;
    }
    return response;
  }
  if (!res) {
    throw new Error("请求出错，请稍候重试");
  }
  const { success, errorMsg } = res;
  const hasSuccess = res && Reflect.has(res, "success") && success;
  if (hasSuccess) {
    return res;
  }
  notification.error({
    message: `请求错误`,
    description: errorMsg,
  });
  return res;
});

export function useRequest(
  prefix?: string,
  option?: {
    request?: () => RequestOptionsInit;
    response?: (T: Response) => any;
  }
) {
  const { request, response } = option ?? {};
  const createClient = extend({
    prefix,
  });
  createClient.interceptors.request.use(
    (url, options) => {
      const others = request?.();
      return {
        url,
        options: { ...options, ...others, interceptors: true },
      };
    },
    { global: true }
  );
  createClient.interceptors.response.use(async (res: Response) => {
    response?.(res);
    return res;
  });

  return createClient;
}
