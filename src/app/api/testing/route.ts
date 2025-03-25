import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
 
type ResponseData = {
  message: string
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if(req.method == "GET"){
    return NextResponse.json({
      "message" : "ok"
    })
  } 
}

export { handler as GET, handler as POST}