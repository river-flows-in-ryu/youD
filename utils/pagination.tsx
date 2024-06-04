import { useEffect, useMemo } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Pagination({
  page,
  totalCount,
  pageSize,
  onChange,
  reviewType,
}: {
  page: number;
  totalCount: number;
  pageSize: number;
  onChange: (page: number) => void;
  reviewType?: string;
}) {
  const router = useRouter();
  const params = usePathname();

  const pagination = useMemo(() => {
    const size = pageSize;
    const block = 5;
    const totalPages = Math.ceil(totalCount / size);
    const currentPage = page;
    const currentBlock = Math.ceil(currentPage / block);

    const startPage = 1 + block * (currentBlock - 1);
    const endPage =
      block * currentBlock < totalPages ? block * currentBlock : totalPages;

    const tempPage = [];
    for (let i = startPage; i <= endPage; i++) {
      tempPage.push(i);
    }
    return tempPage;
  }, [page, totalCount, pageSize]);

  useEffect(() => {
    if (totalCount > 0 && page > totalCount) onChange(totalCount);
  }, [page, totalCount, onChange]);

  const handleClick =
    (param: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event?.preventDefault();
      if (
        param > 0 &&
        param < Math.ceil(totalCount / pageSize) + 1 &&
        param !== page
      ) {
        onChange(param);
        const queryParams = new URLSearchParams();
        queryParams.set("type", reviewType as string);
        queryParams.set("page", param.toString());
        const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
      }
    };
  return (
    <div className="w-full h-[30px] flex justify-center ">
      <button
        className="w-[30px] h-[30px]"
        onClick={handleClick(page - 1)}
        disabled={page === 1}
      >
        <span>&lt;</span>
      </button>
      {page ? (
        <div className="flex mr-2">
          {pagination?.map((number: number, index: number) => {
            return (
              <button
                key={index}
                className={`w-[30px] h-[30px] ${
                  page === number ? "font-bold text-primary" : "text-[#aaa]"
                }`}
                onClick={handleClick(number)}
              >
                {number}
              </button>
            );
          })}
        </div>
      ) : null}

      <button
        className="w-[30px] h-[30px]"
        onClick={handleClick(page + 1)}
        disabled={page === Math.ceil(totalCount / pageSize)}
      >
        <span>&gt;</span>
      </button>
    </div>
  );
}
