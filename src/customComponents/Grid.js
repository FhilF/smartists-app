import * as React from 'react';
import clsx from 'clsx';

export default function Grid({
  children,
  className,
  as: Tag = 'div',
  featured,
  nested,
  rowGap,
}) {
  return (
    <Tag
      className={clsx('relative', {
        'mx-10vw': !nested,
        'w-full': nested,
        'py-10': featured,
      })}
    >
      {featured ? (
        <div className="absolute inset-0 -mx-5vw">
          <div className="bg-secondary mx-auto w-full max-w-8xl h-full rounded-lg" />
        </div>
      ) : null}

      <div
        className={clsx(
          'relative grid gap-x-4 grid-cols-4 md:grid-cols-8 lg:gap-x-6 lg:grid-cols-12',
          {
            'mx-auto max-w-6xl 2xl:max-w-screen-xl': !nested,
            'gap-y-4 lg:gap-y-6': rowGap,
          },
          className,
        )}
      >
        {children}
      </div>
    </Tag>
  );
}
