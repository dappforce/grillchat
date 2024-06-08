import DogClickerAnimation from '@/assets/animations/dog-click.json'
import Lottie, { LottieProps } from 'react-lottie'

export type HamsterLoadingProps = Omit<LottieProps, 'options'>

export default function DogClicker({ ...props }: HamsterLoadingProps) {
  const defaultOptions: LottieProps = {
    ...props,
    options: {
      loop: true,
      autoplay: true,
      animationData: DogClickerAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    },
  }

  return (
    <Lottie
      {...defaultOptions}
      height={250 || props.height}
      width={250 || props.width}
      isClickToPauseDisabled={true}
    />
  )
}
