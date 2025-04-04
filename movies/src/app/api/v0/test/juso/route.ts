import axios from "axios";
import response from "@/app/api";

export async function POST(req: Request) {
  const { keyword } = await req.json();
  // console.log({ keyword }, 3);
  if (!keyword || keyword.length === 0) {
    return response.error("키워드는 최소 2단어 이상입니다.");
    // return Response.json(
    //   {
    //     message: "키워드를 입력해주세요. 최소 2개의 단어 이상을 입력해주세요.",
    //   },
    //   { status: 500, statusText: "No Keyword sent" }
    // );
  }
  const pageNo = new URL(req.url).searchParams.get("pageNo");
  if (!pageNo) {
    return Response.json("페이지 넘버를 넘기시오", {
      status: 500,
      statusText: "No page Number",
    });
  }

  const confmKey = process.env.JUSO_API_KEY!;
  const countPerPage = 20;

  const url = `https://business.juso.go.kr/addrlink/addrLinkApi.do`;

  // const res = await fetch(url);

  // const data = await res.json();
  try {
    const { data } = await axios.get(url, {
      params: {
        confmKey,
        currentPage: pageNo,
        countPerPage,
        keyword,
        resultType: "json",
      },
    });

    if (data.results.common.errorCode !== "0") {
      return response.error(data.results.common.errorMessage, {
        statusText: data.results.common.errorCode,
      });
    }

    const payload: JusoApiResponse = {
      totalCount: Number(data.results.common.totalCount),
      countPerPage,
      currentPage: Number(pageNo),
      items: data.results.juso,
    };

    return response.send<JusoApiResponse>({ ...payload });
  } catch (error: any) {
    return response.error(error.message);
  }
}

interface JusoApiResponse {
  totalCount: number;
  countPerPage: number;
  currentPage: number;
  items: any[];
}
