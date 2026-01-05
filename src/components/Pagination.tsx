import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, baseUrl }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return baseUrl;
    }
    return `${baseUrl}?page=${page}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7; // 最多显示的页码数量
    
    // 总是显示第一页
    pages.push(
      <a
        key={1}
        href={getPageUrl(1)}
        className={`px-3 py-2 rounded-lg transition-colors ${
          currentPage === 1
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
        }`}
      >
        1
      </a>
    );

    // 计算要显示的页码范围
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);
    
    // 调整范围以确保显示足够的页码
    if (endPage - startPage < 4) {
      if (startPage === 2) {
        endPage = Math.min(totalPages - 1, startPage + 4);
      } else {
        startPage = Math.max(2, endPage - 4);
      }
    }

    // 左侧省略号
    if (startPage > 2) {
      pages.push(
        <span key="left-ellipsis" className="px-2 text-gray-500">
          ...
        </span>
      );
    }

    // 中间页码
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(
          <a
            key={i}
            href={getPageUrl(i)}
            className={`px-3 py-2 rounded-lg transition-colors ${
              i === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            {i}
          </a>
        );
      }
    }

    // 右侧省略号
    if (endPage < totalPages - 1) {
      pages.push(
        <span key="right-ellipsis" className="px-2 text-gray-500">
          ...
        </span>
      );
    }

    // 最后一页
    if (totalPages > 1) {
      pages.push(
        <a
          key={totalPages}
          href={getPageUrl(totalPages)}
          className={`px-3 py-2 rounded-lg transition-colors ${
            currentPage === totalPages
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
          }`}
        >
          {totalPages}
        </a>
      );
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-12">
      <div className="text-sm text-gray-500">
        显示 {startItem}-{endItem} 条，共 {totalItems} 条
      </div>
      
      <div className="flex items-center space-x-2">
        {/* 上一页 */}
        {currentPage > 1 && (
          <a
            href={getPageUrl(currentPage - 1)}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>上一页</span>
          </a>
        )}

        {/* 页码 */}
        {renderPageNumbers()}

        {/* 下一页 */}
        {currentPage < totalPages && (
          <a
            href={getPageUrl(currentPage + 1)}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors flex items-center space-x-2"
          >
            <span>下一页</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}