import React from 'react';

interface ContentBlock {
  type: 'h2' | 'h3' | 'paragraph' | 'image' | 'list' | 'table';
  text?: string;
  url?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
  caption?: string;
  alt?: string;
}

interface BlockRendererProps {
  blocks: ContentBlock[];
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks)) {
    return null;
  }

  return (
    <div className="space-y-8 text-gray-700">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={index} className="text-3xl font-bold mt-12 mb-6 text-gray-900 tracking-tight">
                {block.text}
              </h2>
            );

          case 'h3':
            return (
              <h3 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900">
                {block.text}
              </h3>
            );

          case 'paragraph':
            return (
              <p key={index} className="text-lg leading-relaxed text-gray-700 mb-6">
                {block.text}
              </p>
            );

          case 'image':
            return (
              <figure key={index} className="my-8">
                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200">
                  <img
                    src={block.url}
                    alt={block.alt || '文章图片'}
                    className="w-full h-auto"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-center text-sm text-gray-500 mt-3 italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case 'list':
            return (
              <ul key={index} className="space-y-3 my-6 pl-2">
                {block.items?.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-3 mt-2 w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></span>
                    <span className="text-lg text-gray-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            );

          case 'table':
            return (
              <div key={index} className="my-8 overflow-x-auto rounded-xl border border-gray-200 shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      {block.headers?.map((header, i) => (
                        <th key={i} className="p-4 font-semibold text-gray-800 border-b border-gray-200">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {block.rows?.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        {row.map((cell, j) => (
                          <td key={j} className="p-4 text-gray-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};