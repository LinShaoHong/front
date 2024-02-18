import { networkError } from "@/utils/request";
import { useShare } from "@/hooks/useShare";

/**
 * ios 控制相关
 */
const user = useStore('user');
const config = useStore('config');
const { onShareAppMessage } = useShare();

export function useIOS() {
  //ios订阅
  const sub = () => {

  };

  return {
    sub
  }
}