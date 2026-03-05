import type { Column } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Menu,
  MenuPopup,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui/menu';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Menu>
        <MenuTrigger
          render={
            <Button
              className="-ml-3 h-8 data-[state=open]:bg-accent"
              size="sm"
              variant="ghost"
            >
              <span>{title}</span>
              {(() => {
                const sortState = column.getIsSorted();
                if (sortState === 'desc') {
                  return <ArrowDown />;
                }
                if (sortState === 'asc') {
                  return <ArrowUp />;
                }
                return <ChevronsUpDown />;
              })()}
            </Button>
          }
        />
        <MenuPopup align="start">
          <MenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp />
            Asc
          </MenuItem>
          <MenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown />
            Desc
          </MenuItem>
          <MenuSeparator />
          <MenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff />
            Hide
          </MenuItem>
        </MenuPopup>
      </Menu>
    </div>
  );
}
