import React, { useMemo } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import { ExternalLink } from 'lucide-react';

interface ArticleContentProps {
  content: any;
  isMobile?: boolean;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content, isMobile = false }) => {
  // Rich Text rendering options ottimizzate
  const richTextOptions = useMemo(() => ({
    renderMark: {
      [MARKS.BOLD]: (text: React.ReactNode) => <strong className="font-semibold">{text}</strong>,
      [MARKS.ITALIC]: (text: React.ReactNode) => <em className="italic">{text}</em>,
      [MARKS.UNDERLINE]: (text: React.ReactNode) => <u className="underline">{text}</u>,
      [MARKS.CODE]: (text: React.ReactNode) => (
        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">{text}</code>
      ),
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => (
        <p className={`mb-6 text-gray-700 leading-relaxed ${isMobile ? 'text-base' : 'text-lg'}`}>{children}</p>
      ),
      [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => (
        <h1 className={`font-bold text-gray-900 mb-6 mt-8 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => (
        <h2 className={`font-bold text-gray-900 mb-4 mt-8 ${isMobile ? 'text-xl' : 'text-2xl'}`}>{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => (
        <h3 className={`font-semibold text-gray-900 mb-4 mt-6 ${isMobile ? 'text-lg' : 'text-xl'}`}>{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => (
        <h4 className={`font-semibold text-gray-900 mb-3 mt-6 ${isMobile ? 'text-base' : 'text-lg'}`}>{children}</h4>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
        <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
        <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => (
        <li className="ml-4">{children}</li>
      ),
      [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
        <blockquote className="border-l-4 border-violet-500 pl-6 py-4 mb-6 bg-gray-50 italic text-gray-700">
          {children}
        </blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="my-8 border-gray-200" />,
      [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
        <a
          href={node.data.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-600 hover:text-violet-700 underline inline-flex items-center"
        >
          {children}
          <ExternalLink className="w-3 h-3 ml-1" />
        </a>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const asset = node.data.target;
        if (asset?.fields?.file?.contentType?.startsWith('image/')) {
          return (
            <div className="my-8">
              <img
                src={asset.fields.file.url}
                alt={asset.fields.title || 'Image'}
                className="w-full rounded-lg shadow-sm"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
                style={{
                  maxHeight: isMobile ? '40vh' : '60vh',
                  objectFit: 'contain',
                  backgroundColor: '#f9fafb'
                }}
              />
              {asset.fields.description && (
                <p className="text-sm text-gray-500 text-center mt-2 italic">
                  {asset.fields.description}
                </p>
              )}
            </div>
          );
        }
        return null;
      },
    },
  }), [isMobile]);

  return (
    <div className={`prose max-w-none ${isMobile ? 'prose-sm' : 'prose-lg'}`}>
      {documentToReactComponents(content, richTextOptions)}
    </div>
  );
};

export default ArticleContent;