'use client';
import { LayoutPanelLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    CloseActiveGroup,
    CmdPaletteToggle,
    GroupOverlays,
    GroupTabStrip,
    OpenPanel,
    Panels,
    RestoreLayout,
    SaveLayout,
    ToggleLock,
} from './dockview';
// If you add a confirm dialog component from shadcn later, import it here.

function MyInspector() {
    return <div className='p-3'>inspector</div>;
}

// TODO: <PanelsCtx.Provider value={{ apiRef, state, dispatch, select, isPinned, components: panelComponents, groups }}>

export default function Page() {
    return (
        <Panels
            className='rounded-md border'
            seed={[{ id: 'welcome', title: 'Welcome', component: 'default' }]}>
            <GroupOverlays>
                {(g) => (
                    <div className='relative h-full w-full'>
                        {/* Top tab-strip across this group */}
                        <div className='absolute left-0 right-0 top-0'>
                            <GroupTabStrip groupId={g.id} />
                        </div>

                        {/* Example: bottom breadcrumb/secondary strip */}
                        {/* <div className="absolute left-0 right-0 bottom-0 opacity-80">
        <YourCustomBreadcrumb groupId={g.id} />
      </div> */}
                    </div>
                )}
            </GroupOverlays>
            <div className='inset-x-2 top-2 z-10 flex items-center gap-2'>
                <CmdPaletteToggle asChild>
                    <Button variant='secondary'>⌘K</Button>
                </CmdPaletteToggle>
                <OpenPanel
                    asChild
                    component='default'
                    title='New'
                    position='right'>
                    <Button>Split Right</Button>
                </OpenPanel>
                <OpenPanel
                    asChild
                    component='default'
                    title='Console'
                    position='below'>
                    <Button>Split Bottom</Button>
                </OpenPanel>
                <ToggleLock asChild>
                    <Button variant='outline'>Lock/Unlock</Button>
                </ToggleLock>
                <SaveLayout asChild>
                    <Button variant='ghost'>Save</Button>
                </SaveLayout>
                <RestoreLayout asChild>
                    <Button variant='ghost'>Restore</Button>
                </RestoreLayout>
                <CloseActiveGroup asChild>
                    <Button variant='destructive'>Close Group</Button>
                </CloseActiveGroup>
            </div>
        </Panels>
    );
}
