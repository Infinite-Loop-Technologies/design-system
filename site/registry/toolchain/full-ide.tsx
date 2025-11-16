'use client';

import * as React from 'react';
import { PanelBoard, type BoardLayout } from '@/components/panels/panel-board';
import type { TabItem } from '@/components/panels/animated-tab-strip';
import {
    EphemeralPanelProvider,
    useEphemeralPanels,
} from '@/components/panels/ephemeral-provider';

import {
    PromptInput,
    type PromptInputMessage,
    PromptInputSubmit,
    PromptInputTextarea,
} from '@/components/ai-elements/prompt-input';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
    Conversation,
    ConversationContent,
} from '@/components/ai-elements/conversation';
import {
    WebPreview,
    WebPreviewNavigation,
    WebPreviewUrl,
    WebPreviewBody,
} from '@/components/ai-elements/web-preview';
import { Loader } from '@/components/ai-elements/loader';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';

type Chat = { id: string; demo: string };

type TabData = { kind: 'preview'; url?: string } | { kind: 'chat' };

function tab<T>(
    id: string,
    title: string,
    data: T,
    renderBody: TabItem<T>['renderBody']
): TabItem<T> {
    return { id, title, data, renderBody, closable: false };
}

function useV0Layout() {
    // two tabs in one slot: Preview + Build
    const [currentChat, setCurrentChat] = React.useState<Chat | null>(null);
    const [message, setMessage] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [chatHistory, setChatHistory] = React.useState<
        Array<{ type: 'user' | 'assistant'; content: string }>
    >([]);

    const PreviewTab = React.useMemo<TabItem<TabData>>(
        () =>
            tab<TabData>(
                'preview',
                'Preview',
                { kind: 'preview', url: currentChat?.demo },
                (it) => (
                    <div className='h-full w-full'>
                        <WebPreview>
                            <WebPreviewNavigation>
                                <WebPreviewUrl
                                    readOnly
                                    placeholder='Your app here...'
                                    value={(it.data as any)?.url}
                                />
                            </WebPreviewNavigation>
                            <WebPreviewBody src={(it.data as any)?.url} />
                        </WebPreview>
                    </div>
                )
            ),
        [currentChat?.demo]
    );

    const BuildTab = React.useMemo<TabItem<TabData>>(
        () =>
            tab<TabData>('build', 'Build', { kind: 'chat' }, () => (
                <div className='h-full w-full flex flex-col'>
                    <div className='border-b p-3 h-14 flex items-center justify-between'>
                        <h1 className='text-lg font-semibold'>v0 Clone</h1>
                    </div>
                    <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                        {chatHistory.length === 0 ? (
                            <div className='text-center font-semibold mt-8'>
                                <p className='text-3xl mt-4'>
                                    What can we build together?
                                </p>
                            </div>
                        ) : (
                            <>
                                <Conversation>
                                    <ConversationContent>
                                        {chatHistory.map((msg, index) => (
                                            <Message
                                                from={msg.type}
                                                key={index}>
                                                <MessageContent>
                                                    {msg.content}
                                                </MessageContent>
                                            </Message>
                                        ))}
                                    </ConversationContent>
                                </Conversation>
                                {isLoading && (
                                    <Message from='assistant'>
                                        <MessageContent>
                                            <div className='flex items-center gap-2'>
                                                <Loader />
                                                Creating your app...
                                            </div>
                                        </MessageContent>
                                    </Message>
                                )}
                            </>
                        )}
                    </div>
                    <div className='border-t p-4'>
                        {!currentChat && (
                            <Suggestions>
                                <Suggestion
                                    onClick={() =>
                                        setMessage(
                                            'Create a responsive navbar with Tailwind CSS'
                                        )
                                    }
                                    suggestion='Create a responsive navbar with Tailwind CSS'
                                />
                                <Suggestion
                                    onClick={() =>
                                        setMessage(
                                            'Build a todo app with React'
                                        )
                                    }
                                    suggestion='Build a todo app with React'
                                />
                                <Suggestion
                                    onClick={() =>
                                        setMessage(
                                            'Make a landing page for a coffee shop'
                                        )
                                    }
                                    suggestion='Make a landing page for a coffee shop'
                                />
                            </Suggestions>
                        )}
                        <div className='flex gap-2'>
                            <PromptInput
                                onSubmit={handleSendMessage}
                                className='mt-4 w-full max-w-2xl mx-auto relative'>
                                <PromptInputTextarea
                                    onChange={(e) => setMessage(e.target.value)}
                                    value={message}
                                    className='pr-12 min-h-[60px]'
                                />
                                <PromptInputSubmit
                                    className='absolute bottom-1 right-1'
                                    disabled={!message}
                                    status={isLoading ? 'streaming' : 'ready'}
                                />
                            </PromptInput>
                        </div>
                    </div>
                </div>
            )),
        [chatHistory, isLoading, message]
    );

    async function handleSendMessage(promptMessage: PromptInputMessage) {
        const hasText = Boolean(promptMessage.text);
        const hasAttachments = Boolean(promptMessage.files?.length);
        if (!(hasText || hasAttachments) || isLoading) return;

        const userMessage =
            promptMessage.text?.trim() || 'Sent with attachments';
        setMessage('');
        setIsLoading(true);
        setChatHistory((prev) => [
            ...prev,
            { type: 'user', content: userMessage },
        ]);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    chatId: currentChat?.id,
                }),
            });
            if (!res.ok) throw new Error('Failed to create chat');
            const chat: Chat = await res.json();
            setCurrentChat(chat);
            setChatHistory((prev) => [
                ...prev,
                {
                    type: 'assistant',
                    content:
                        'Generated new app preview. Check the Preview tab!',
                },
            ]);
        } catch (e) {
            console.error(e);
            setChatHistory((prev) => [
                ...prev,
                {
                    type: 'assistant',
                    content:
                        'Sorry, there was an error creating your app. Please try again.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    const layout: BoardLayout<TabData> = React.useMemo(
        () => ({
            v0: {
                id: 'v0',
                tabs: [PreviewTab, BuildTab],
                activeId: 'build', // start in AI tab
            },
        }),
        [PreviewTab, BuildTab]
    );

    return { layout };
}

export default function V0Page() {
    const { layout } = useV0Layout();

    return <h1>todo</h1>;
}
