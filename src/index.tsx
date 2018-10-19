import * as React from 'react';

export interface IScrollspyNavProps
{
    scrollTargetIds: string[],
    activeNavClass: string,
    scrollDuration?: number,
    headerBackground?: boolean,
    router?: string,
}

export class ScrollspyNav extends React.Component<IScrollspyNavProps, {}>
{
    private readonly _scrollTargetIds: string[];
    private readonly _activeNavClass: string;
    private readonly _scrollDuration: number;
    private readonly _headerBackground: boolean;
    private readonly _homeDefaultLink: string;
    private readonly _hashIdentifier: string;

    constructor(props: IScrollspyNavProps)
    {
        super(props);

        this._scrollTargetIds = this.props.scrollTargetIds;
        this._activeNavClass = this.props.activeNavClass;
        this._scrollDuration = this.props.scrollDuration || 1000;
        this._headerBackground = this.props.headerBackground === true ? true : false;

        if (this.props.router && this.props.router === "HashRouter")
        {
            this._homeDefaultLink = "#/";
            this._hashIdentifier = "#/#";
        }
        else
        {
            this._homeDefaultLink = "/";
            this._hashIdentifier = "#";
        }
    }

    public componentDidMount(): void
    {
        const aHomeLink = document.querySelector(`a[href='${this._homeDefaultLink}']`);
        const divNavList = document.querySelector("div[data-nav='list']");

        if (aHomeLink)
        {
            aHomeLink.addEventListener("click", (event) =>
            {
                event.preventDefault();
                this._scrollTo(window.pageYOffset, 0, this._scrollDuration);
                window.location.hash = "";
            });
        }

        if (divNavList)
        {
            divNavList.querySelectorAll("a").forEach((navLink) =>
            {
                navLink.addEventListener("click", (event) =>
                {
                    event.preventDefault();
                    const sectionID = this._getNavToSectionID(navLink.getAttribute("href"));

                    if (sectionID)
                    {
                        const scrollTarget = document.getElementById(sectionID);
                        if (scrollTarget)
                        {
                            const scrollTargetPosition = scrollTarget.offsetTop - (this._headerBackground ? divNavList.scrollHeight : 0);
                            this._scrollTo(window.pageYOffset, scrollTargetPosition, this._scrollDuration);
                        }
                    }
                    else
                    {
                        this._scrollTo(window.pageYOffset, 0, this._scrollDuration);
                    }
                });
            })

            window.addEventListener("scroll", () =>
            {
                let scrollSectionOffsetTop;
                this._scrollTargetIds.map((sectionID, index) =>
                {
                    const scrollTarget = document.getElementById(sectionID);
                    const navLinkElement = this._getNavLinkElement(sectionID);

                    if (scrollTarget && navLinkElement)
                    {
                        scrollSectionOffsetTop = scrollTarget.offsetTop - (this._headerBackground ? divNavList.scrollHeight : 0);

                        if (window.pageYOffset >= scrollSectionOffsetTop && window.pageYOffset < scrollSectionOffsetTop + scrollTarget.scrollHeight)
                        {
                            navLinkElement.classList.add(this._activeNavClass);
                            this._clearOtherNavLinkActiveStyle(sectionID)
                        }
                        else
                        {
                            navLinkElement.classList.remove(this._activeNavClass);
                        }

                        if (window.innerHeight + window.pageYOffset >= document.body.scrollHeight && index === this._scrollTargetIds.length - 1)
                        {
                            navLinkElement.classList.add(this._activeNavClass);
                            this._clearOtherNavLinkActiveStyle(sectionID);
                        }
                    }
                });
            });
        }
    }

    public render(): JSX.Element | null
    {
        return (
            <div data-nav="list">
                {this.props.children}
            </div>
        );
    }

    private _easeInOutQuad(current_time, start, change, duration)
    {
        current_time /= duration / 2;
        if (current_time < 1) return change / 2 * current_time * current_time + start;
        current_time--;
        return -change / 2 * (current_time * (current_time - 2) - 1) + start;
    };

    private _scrollTo(start, to, duration)
    {
        let change = to - start,
            currentTime = 0,
            increment = 10;

        let animateScroll = () =>
        {
            currentTime += increment;
            let val = this._easeInOutQuad(currentTime, start, change, duration);
            window.scrollTo(0, val);
            if (currentTime < duration)
            {
                setTimeout(animateScroll, increment);
            }
        };

        animateScroll();
    }

    private _getNavLinkElement(sectionID): Element | null
    {
        return document.querySelector(`a[href='${this._hashIdentifier}${sectionID}']`);
    }

    private _getNavToSectionID(navHref): string | null
    {
        return navHref.includes(this._hashIdentifier)
            ? navHref.replace(this._hashIdentifier, "")
            : null;
    }

    private _clearOtherNavLinkActiveStyle(excludeSectionID): void
    {
        this._scrollTargetIds.map((sectionID, index) =>
        {
            if (sectionID !== excludeSectionID)
            {
                const navLinkElement = this._getNavLinkElement(sectionID);
                if (navLinkElement)
                {
                    navLinkElement.classList.remove(this._activeNavClass);
                }
            }
        });
    }
}
