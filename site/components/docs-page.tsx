import { Prose } from '@/registry/new-york/ui/prose/prose';
import { cn } from '@/lib/utils';
import React from 'react';
import { ReactNode } from 'react';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
    ItemContent,
    ItemTitle,
    ItemDescription,
    ItemActions,
    Item,
} from '@/components/ui/item';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
    ArrowLeftIcon,
    MoreHorizontalIcon,
    MailCheckIcon,
    ArchiveIcon,
    ClockIcon,
    CalendarPlusIcon,
    ListFilterPlusIcon,
    TagIcon,
    Trash2Icon,
    ArrowRightIcon,
} from 'lucide-react';
import { ButtonGroup } from '@/components/ui/button-group';
import { ScrollArea } from './ui/scroll-area';
import { PreviewWithFullscreen } from './ui/preview-with-controls';

export function PageTitle({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
export function PageDescription({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
export function PageActions({ children }: { children?: ReactNode }) {
    if (!children) {
        return (
            <ButtonGroup>
                <ButtonGroup>
                    <Button variant='outline' size='sm'>
                        Snooze
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant='outline'
                                size='sm'
                                aria-label='More Options'>
                                <MoreHorizontalIcon />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-52'>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <MailCheckIcon />
                                    Mark as Read
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <ArchiveIcon />
                                    Archive
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <ClockIcon />
                                    Snooze
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <CalendarPlusIcon />
                                    Add to Calendar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <ListFilterPlusIcon />
                                    Add to List
                                </DropdownMenuItem>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <TagIcon />
                                        Label As...
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuRadioGroup value={'asdf'}>
                                            <DropdownMenuRadioItem value='personal'>
                                                Personal
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value='work'>
                                                Work
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value='other'>
                                                Other
                                            </DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem variant='destructive'>
                                    <Trash2Icon />
                                    Trash
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </ButtonGroup>
                <ButtonGroup className='hidden sm:flex'>
                    <Button variant='outline' size='sm' aria-label='Go Back'>
                        <ArrowLeftIcon />
                    </Button>
                    <Button variant='outline' size='sm' aria-label='Go Back'>
                        <ArrowRightIcon />
                    </Button>
                </ButtonGroup>
            </ButtonGroup>
        );
    }
    return <>{children}</>;
}

export function DocsPageHeader({ children }: { children: ReactNode }) {
    const kids = React.Children.toArray(children);
    const title = kids.find(
        (child) => React.isValidElement(child) && child.type === PageTitle
    );
    const description = kids.find(
        (child) => React.isValidElement(child) && child.type === PageDescription
    );
    const actions = kids.find(
        (child) => React.isValidElement(child) && child.type === PageActions
    );

    // For this, we can detect PageTitle, PageDescription, and PageActions. PageActions go top-right - like shadcn.
    return (
        <>
            <div className='bg-red flex justify-between items-center'>
                <div>{title}</div>
                <div>{actions}</div>
            </div>
            <ItemDescription>{description}</ItemDescription>
        </>
    );
}

export function ExamplePreview({ children }: { children?: ReactNode }) {
    return (
        <ScrollArea>
            <AspectRatio ratio={16 / 9} className='bg-card rounded-lg'>
                {children}
            </AspectRatio>
        </ScrollArea>
    );
}

// QUESTION: how do you make it so that if the child is a certain comp like <DocsPageHeader> it's treated special?
export function DocsPage({ children }: { children?: ReactNode }) {
    // Maybe it's time to screw around with this, never have before:
    const kids = React.Children.toArray(children);

    const header = kids.find(
        (child: any) =>
            React.isValidElement(child) && child.type === DocsPageHeader
    );

    const rest = kids.filter(
        (child: any) =>
            !(React.isValidElement(child) && child.type === DocsPageHeader)
    );
    const examples = kids.filter(
        (child: any) =>
            (React.isValidElement(child) && child.type === ExamplePreview) ||
            child.type === PreviewWithFullscreen
    );

    // Random possibility - allow a prop full-width or something - neat concept. Just like Notion.

    return (
        <div className='mx-auto h-full w-3xl'>
            <Prose>
                {header && (
                    <div>
                        <h1>{header}</h1>
                    </div>
                )}

                {examples && (
                    <div className='flex flex-col space-y-16'>{examples}</div>
                )}
            </Prose>
        </div>
    );
}
