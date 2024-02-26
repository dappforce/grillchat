import { Space_Mono } from 'next/font/google'
import localFont from 'next/font/local'

export const spaceMono = Space_Mono({
  weight: '400',
  subsets: ['latin'],
})

export const landingFont = localFont({
  src: [
    {
      path: './assets/fonts/GTWalsheimPro/GTWalsheimPro-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './assets/fonts/GTWalsheimPro/GTWalsheimPro-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './assets/fonts/GTWalsheimPro/GTWalsheimPro-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
})
