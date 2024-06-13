import CatClickerAnimation from '@/assets/animations/cat-clicker.json'
import Lottie, { LottieProps } from 'react-lottie'

export type HamsterLoadingProps = Omit<LottieProps, 'options'>

export default function CatClicker({ ...props }: HamsterLoadingProps) {
  const defaultOptions: LottieProps = {
    ...props,
    options: {
      loop: true,
      autoplay: true,
      animationData: CatClickerAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    },
  }

  return <Lottie {...defaultOptions} isClickToPauseDisabled={true} />
}
