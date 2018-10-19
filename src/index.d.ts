import * as React from 'react';
export interface IScrollspyNavProps {
    scrollTargetIds: string[];
    activeNavClass: string;
    scrollDuration?: number;
    headerBackground?: boolean;
    router?: string;
}
export declare class ScrollspyNav extends React.Component<IScrollspyNavProps, {}> {
    private readonly _scrollTargetIds;
    private readonly _activeNavClass;
    private readonly _scrollDuration;
    private readonly _headerBackground;
    private readonly _homeDefaultLink;
    private readonly _hashIdentifier;
    constructor(props: IScrollspyNavProps);
    componentDidMount(): void;
    render(): JSX.Element | null;
    private _easeInOutQuad;
    private _scrollTo;
    private _getNavLinkElement;
    private _getNavToSectionID;
    private _clearOtherNavLinkActiveStyle;
}
