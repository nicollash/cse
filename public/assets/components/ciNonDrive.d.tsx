import * as React from "react"
import { FunctionComponent } from "react"

interface Props {
  width?: string,
  height?: string,
  selected?: boolean,
  props?: React.SVGProps<SVGSVGElement>
}

export const CI_NonDrive: FunctionComponent<Props> = ({
  width,
  height,
  selected,
  ...props
}) => {
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      width={width ? width : "1em"}
      height={height ? height : "1em"}
      viewBox={"0 0 512 512"}
      {...props}
    >
      <path d="M231.5 1.1c-80 8.3-150.1 51.8-192.7 119.6-49.4 78.6-51.6 181-5.6 261.3 12 21 23.7 36.2 41.1 53.8 21.2 21.5 41.9 36.4 69.2 49.8 26 12.7 50.9 20.3 81 24.6 11.9 1.7 51.2 1.6 63.5-.1 62.1-8.6 114.9-36.1 157.1-81.8 35-38 57.3-86.2 65.1-140.8 1.7-11.8 1.7-51.2 0-63-8.3-58.3-32.1-107.3-71.5-147.4C398.3 36 348.8 10.9 291.5 2.4c-12.3-1.8-47.8-2.6-60-1.3zm54.4 47.4c21.9 3.1 41.7 9.2 62.6 19.4 9.3 4.6 28.4 15.9 31.5 18.8.2.2-5.5 6.3-12.8 13.6L354 113.5l6.6 4.9c13.7 10.1 23.6 28.8 26 48.8.4 3.2.9 5.8 1.3 5.8.3 0 9.2-8.6 19.8-19.2 18.3-18.3 19.3-19.1 20.7-17.3 8.1 10.9 20.4 35.4 25.9 51.6 11.9 34.7 14.4 73.3 7.1 109.9-8.1 40.3-28 76.9-57.8 106.5-13 12.9-21.9 20.1-36.1 29-66.3 41.8-151.4 42.8-218.5 2.7-16.5-9.9-16.1-7.6-4-19.7 8.9-8.9 10.1-10.5 8.4-11.1-10.7-3.7-18-10-22.2-19.2-2.2-4.8-2.7-7.5-3-16.9l-.4-11.2-5.3-4-5.2-3.9-14.9 14.9C94.2 373.3 87.3 380 87 380c-.9 0-11.8-17.3-16.5-26.1-11-20.9-17.8-42-22.1-68.4-2.4-14.7-2.3-44.6 0-60 5.8-37 20.4-70.7 43.5-100 7-9 24.6-26.6 33.7-33.8 33.2-26.1 72.8-41.4 116.9-45.1 8.9-.7 31.7.3 43.4 1.9z" />
      <path d="M185 122.9c-21.4 2.9-35.3 15.6-41.1 37.8-1.5 5.7-2.2 12.2-2.6 24.5l-.6 16.6-10.4.4c-10 .3-10.6.4-12.9 3.1-2.3 2.6-2.4 3.5-2.4 15.2s.1 12.6 2.4 15.2c2.3 2.7 2.9 2.8 12.6 3.1 5.5.2 10 .7 9.8 1-.2.4-2 3.9-4.1 7.9-2 4-4.9 11.2-6.4 16-2.5 8.5-2.7 9.9-3.1 37.2-.3 24.9-.2 28.9 1.3 32.8 2 5.3 7.7 9.8 13.5 10.8l4 .7v15.1c0 18 1.2 21.8 8.1 26.4 4.2 2.8 4.3 2.8 21.3 2.8 16.1 0 17.3-.1 20.8-2.3 2-1.3 4.7-4 6-6 2.1-3.4 2.3-5.1 2.6-19.9l.4-16.3h103.6l.4 16.2c.3 14.9.5 16.6 2.6 20 1.3 2 4 4.7 6 6 3.5 2.2 4.7 2.3 20.8 2.3 17 0 17.1 0 21.3-2.8 6.9-4.6 8.1-8.4 8.1-26.4v-15.1l4-.7c5.8-1 11.5-5.5 13.5-10.8 1.5-3.9 1.6-7.9 1.3-32.8-.4-27.3-.6-28.7-3.1-37.2-1.5-4.8-4.4-12-6.4-16-2.1-4-3.9-7.5-4.1-7.9-.2-.3 4.3-.8 9.8-1 9.7-.3 10.3-.4 12.6-3.1 2.3-2.6 2.4-3.5 2.4-15.2s-.1-12.6-2.4-15.2c-2.3-2.7-2.9-2.8-12.9-3.1l-10.4-.4-.6-16.6c-1.1-35.9-11-52.6-35.7-60.8-5.1-1.7-10.8-1.8-75-2-38.2-.1-72 .1-75 .5zm137 21.7c10.3 3.1 16.7 9.2 21.3 20.5 2 5 2.2 7.5 2.5 31.7l.3 26.3-3.4 3.4-3.5 3.5H172.8l-3.5-3.5-3.4-3.4.3-26.3c.3-24.2.5-26.7 2.5-31.7 4.5-11.1 11-17.4 20.9-20.4 7.6-2.4 124.6-2.4 132.4-.1zM183.9 264c8.4 4.3 13.3 12.5 13.2 22.1 0 13.9-10 23.9-23.9 23.9-14.5 0-24.6-9.9-24.6-24 0-18.4 19.2-30.3 35.3-22zm118.1.5v3.5h-92v-7h92v3.5zm45.4-2.3c6.2 1.9 13.1 9.2 15.1 16.2 2 6.8 1.4 12.1-2.3 18.9-11.8 22-45.5 13-45.3-12.1 0-17.1 15.5-28 32.5-23zM302 306.5v3.5h-92v-7h92v3.5z" />
    </svg>
  )
}