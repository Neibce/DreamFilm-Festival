import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const pretendard = localFont({
  src: [
    { path: './fonts/Pretendard-Thin.woff2', weight: '100', style: 'normal' },
    { path: './fonts/Pretendard-ExtraLight.woff2', weight: '200', style: 'normal' },
    { path: './fonts/Pretendard-Light.woff2', weight: '300', style: 'normal' },
    { path: './fonts/Pretendard-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/Pretendard-Medium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/Pretendard-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: './fonts/Pretendard-Bold.woff2', weight: '700', style: 'normal' },
    { path: './fonts/Pretendard-ExtraBold.woff2', weight: '800', style: 'normal' },
    { path: './fonts/Pretendard-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-pretendard',
})

const clipartkorea = localFont({
  src: [
    { path: './fonts/Clipartkorea-Light.woff', weight: '300', style: 'normal' },
    { path: './fonts/Clipartkorea-Regular.woff', weight: '400', style: 'normal' },
    { path: './fonts/Clipartkorea-Medium.woff', weight: '500', style: 'normal' },
    { path: './fonts/Clipartkorea-Bold.woff', weight: '700', style: 'normal' },
  ],
  variable: '--font-clipartkorea',
})

export const metadata: Metadata = {
  title: 'DreamFilm Festival',
  description: 'Transform your dreams into cinematic masterpieces with AI-powered film creation and community voting',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${pretendard.variable} ${clipartkorea.variable}`}>
      <body className={`antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
