import LoadingAnimation from '@/assets/animations/loading.json'
import Lottie, { LottieProps } from 'react-lottie'

export type HamsterLoadingProps = Omit<LottieProps, 'options'>

export default function HamsterLoading(props: HamsterLoadingProps) {
  const defaultOptions: LottieProps = {
    ...props,
    options: {
      loop: true,
      autoplay: true,
      animationData: LoadingAnimation,
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
    />
  )
}
