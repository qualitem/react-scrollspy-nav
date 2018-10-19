"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = require("react");
var ScrollspyNav = /** @class */ (function (_super) {
    tslib_1.__extends(ScrollspyNav, _super);
    function ScrollspyNav(props) {
        var _this = _super.call(this, props) || this;
        _this._scrollTargetIds = _this.props.scrollTargetIds;
        _this._activeNavClass = _this.props.activeNavClass;
        _this._scrollDuration = _this.props.scrollDuration || 1000;
        _this._headerBackground = _this.props.headerBackground === true ? true : false;
        if (_this.props.router && _this.props.router === "HashRouter") {
            _this._homeDefaultLink = "#/";
            _this._hashIdentifier = "#/#";
        }
        else {
            _this._homeDefaultLink = "/";
            _this._hashIdentifier = "#";
        }
        return _this;
    }
    ScrollspyNav.prototype.componentDidMount = function () {
        var _this = this;
        var aHomeLink = document.querySelector("a[href='" + this._homeDefaultLink + "']");
        var divNavList = document.querySelector("div[data-nav='list']");
        if (aHomeLink) {
            aHomeLink.addEventListener("click", function (event) {
                event.preventDefault();
                _this._scrollTo(window.pageYOffset, 0, _this._scrollDuration);
                window.location.hash = "";
            });
        }
        if (divNavList) {
            divNavList.querySelectorAll("a").forEach(function (navLink) {
                navLink.addEventListener("click", function (event) {
                    event.preventDefault();
                    var sectionID = _this._getNavToSectionID(navLink.getAttribute("href"));
                    if (sectionID) {
                        var scrollTarget = document.getElementById(sectionID);
                        if (scrollTarget) {
                            var scrollTargetPosition = scrollTarget.offsetTop - (_this._headerBackground ? divNavList.scrollHeight : 0);
                            _this._scrollTo(window.pageYOffset, scrollTargetPosition, _this._scrollDuration);
                        }
                    }
                    else {
                        _this._scrollTo(window.pageYOffset, 0, _this._scrollDuration);
                    }
                });
            });
            window.addEventListener("scroll", function () {
                var scrollSectionOffsetTop;
                _this._scrollTargetIds.map(function (sectionID, index) {
                    var scrollTarget = document.getElementById(sectionID);
                    var navLinkElement = _this._getNavLinkElement(sectionID);
                    if (scrollTarget && navLinkElement) {
                        scrollSectionOffsetTop = scrollTarget.offsetTop - (_this._headerBackground ? divNavList.scrollHeight : 0);
                        if (window.pageYOffset >= scrollSectionOffsetTop && window.pageYOffset < scrollSectionOffsetTop + scrollTarget.scrollHeight) {
                            navLinkElement.classList.add(_this._activeNavClass);
                            _this._clearOtherNavLinkActiveStyle(sectionID);
                        }
                        else {
                            navLinkElement.classList.remove(_this._activeNavClass);
                        }
                        if (window.innerHeight + window.pageYOffset >= document.body.scrollHeight && index === _this._scrollTargetIds.length - 1) {
                            navLinkElement.classList.add(_this._activeNavClass);
                            _this._clearOtherNavLinkActiveStyle(sectionID);
                        }
                    }
                });
            });
        }
    };
    ScrollspyNav.prototype.render = function () {
        return (React.createElement("div", { "data-nav": "list" }, this.props.children));
    };
    ScrollspyNav.prototype._easeInOutQuad = function (current_time, start, change, duration) {
        current_time /= duration / 2;
        if (current_time < 1)
            return change / 2 * current_time * current_time + start;
        current_time--;
        return -change / 2 * (current_time * (current_time - 2) - 1) + start;
    };
    ;
    ScrollspyNav.prototype._scrollTo = function (start, to, duration) {
        var _this = this;
        var change = to - start, currentTime = 0, increment = 10;
        var animateScroll = function () {
            currentTime += increment;
            var val = _this._easeInOutQuad(currentTime, start, change, duration);
            window.scrollTo(0, val);
            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    };
    ScrollspyNav.prototype._getNavLinkElement = function (sectionID) {
        return document.querySelector("a[href='" + this._hashIdentifier + sectionID + "']");
    };
    ScrollspyNav.prototype._getNavToSectionID = function (navHref) {
        return navHref.includes(this._hashIdentifier)
            ? navHref.replace(this._hashIdentifier, "")
            : null;
    };
    ScrollspyNav.prototype._clearOtherNavLinkActiveStyle = function (excludeSectionID) {
        var _this = this;
        this._scrollTargetIds.map(function (sectionID, index) {
            if (sectionID !== excludeSectionID) {
                var navLinkElement = _this._getNavLinkElement(sectionID);
                if (navLinkElement) {
                    navLinkElement.classList.remove(_this._activeNavClass);
                }
            }
        });
    };
    return ScrollspyNav;
}(React.Component));
exports.ScrollspyNav = ScrollspyNav;
//# sourceMappingURL=index.js.map