import { isMp } from "@/utils/platform";
import { fetchEventSource } from "@microsoft/fetch-event-source";

/**
 * SSE相关
 */
export function useSSE() {
  let task = null;

  const connect = async (url, listener: (event: any) => void) => {
    if (isMp) {
      mpConnect(url, listener);
    } else {
      await h5Connect(url, listener);
    }
  };

  const abort = () => {
    if (task != null) {
      // @ts-ignore
      task.abort();
    }
  }

  const mpConnect = (url, listener: (event: any) => void) => {
    // @ts-ignore
    task = wx.request({
      url: url,
      enableChunked: true,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Accept": 'text/event-stream',
        "Transfer-Encoding": 'chunked',
      },
      timeout: 50000,
      responseType: 'text',
      method: 'GET',
    });
    const callback = data => {
      const ev = decodeURIComponent(String.fromCharCode(...new Uint8Array(data.data)));
      const arr = ev.split("\n")
      const e = arr.length > 1 ? arr[1] : arr[0];
      listener(JSON.parse(e.substring(6)));
    };
    if (task != null) {
      // @ts-ignore
      task.onChunkReceived(callback);
    }
  };

  const h5Connect = async (url, listener: (e: any) => void) => {
    await fetchEventSource(url, {
      onmessage: (ev) => {
        listener(JSON.parse(ev.data));
      }
    });
  };

  return {
    sseConnect: connect,
    sseAbort: abort
  }
}