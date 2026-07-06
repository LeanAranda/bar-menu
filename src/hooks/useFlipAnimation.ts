'use client';

import { useCallback, useEffect, useRef } from 'react';

export function useFlipAnimation(dataAttr: string, data: unknown) {
  const listRef = useRef<HTMLDivElement>(null);
  const posMapRef = useRef<Map<string, number>>(new Map());
  const reorderPendingRef = useRef(false);

  const snapshotPositions = useCallback(() => {
    const map = new Map<string, number>();
    if (listRef.current) {
      listRef.current.querySelectorAll<HTMLElement>(`[${dataAttr}]`).forEach((el) => {
        const id = el.getAttribute(dataAttr);
        if (id) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0) map.set(id, rect.top);
        }
      });
    }
    posMapRef.current = map;
    reorderPendingRef.current = true;
  }, [dataAttr]);

  useEffect(() => {
    if (!reorderPendingRef.current) return;
    const container = listRef.current;
    if (!container) return;

    const map = posMapRef.current;
    if (map.size === 0) return;

    const els = container.querySelectorAll<HTMLElement>(`[${dataAttr}]`);
    const moves: { el: HTMLElement; dy: number }[] = [];

    els.forEach((el) => {
      const id = el.getAttribute(dataAttr);
      if (id) {
        const oldTop = map.get(id);
        if (oldTop !== undefined) {
          const newTop = el.getBoundingClientRect().top;
          const dy = oldTop - newTop;
          if (Math.abs(dy) > 0.5) {
            moves.push({ el, dy });
          }
        }
      }
    });

    if (moves.length === 0) return;

    requestAnimationFrame(() => {
      moves.forEach(({ el, dy }) => {
        el.style.transition = 'none';
        el.style.transform = `translateY(${dy}px)`;
      });
      requestAnimationFrame(() => {
        moves.forEach(({ el }) => {
          el.style.transition = 'transform 300ms ease';
          el.style.transform = '';
        });
        setTimeout(() => {
          moves.forEach(({ el }) => {
            el.style.transition = '';
            el.style.transform = '';
          });
        }, 300);
      });
    });

    posMapRef.current = new Map();
    reorderPendingRef.current = false;
  }, [data, dataAttr]);

  return { listRef, snapshotPositions };
}
