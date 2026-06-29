import { useEffect, useLayoutEffect, useRef, useState, type ComponentType } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';

export type DriveRowAction = {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  onClick: () => void;
  tone?: 'default' | 'danger';
  dividerBefore?: boolean;
};

type DriveRowActionsMenuProps = {
  actions: DriveRowAction[];
};

type MenuPosition = {
  top: number;
  left: number;
};

export const DriveRowActionsMenu = ({ actions }: DriveRowActionsMenuProps) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const menuWidth = 220;
    const menuHeight = menuRef.current?.offsetHeight ?? actions.length * 44 + 16;
    const viewportPadding = 8;

    let top = rect.bottom + 4;
    let left = rect.right - menuWidth;

    if (top + menuHeight > window.innerHeight - viewportPadding) {
      top = rect.top - menuHeight - 4;
    }
    if (left < viewportPadding) {
      left = viewportPadding;
    }
    if (left + menuWidth > window.innerWidth - viewportPadding) {
      left = window.innerWidth - menuWidth - viewportPadding;
    }

    setPosition({ top, left });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, actions.length]);

  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    const handleScroll = () => setOpen(false);

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open]);

  const menu = open
    ? createPortal(
        <div
          ref={menuRef}
          role="menu"
          className="fixed z-[100] min-w-[13.75rem] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-1.5 shadow-[var(--shadow-soft)]"
          style={{ top: position.top, left: position.left }}
        >
          {actions.map((action) => {
            const Icon = action.icon;
            const isDanger = action.tone === 'danger';
            return (
              <div key={action.key}>
                {action.dividerBefore ? (
                  <hr className="my-1.5 border-0 border-t border-[var(--border-subtle)]" />
                ) : null}
                <button
                  type="button"
                  role="menuitem"
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-[var(--bg-surface)] ${
                    isDanger ? 'text-[var(--error)]' : 'text-[var(--text-primary)]'
                  }`}
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpen(false);
                    action.onClick();
                  }}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${isDanger ? 'text-[var(--error)]' : 'text-[var(--text-secondary)]'}`}
                  />
                  {action.label}
                </button>
              </div>
            );
          })}
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] opacity-70 transition-all hover:bg-[var(--bg-surface)] hover:opacity-100 group-hover:opacity-100"
        aria-label="Más acciones"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {menu}
    </>
  );
};
