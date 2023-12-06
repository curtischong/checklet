export const AuthBoxCss = (): JSX.Element => {
    // https://www.gstatic.com/firebasejs/ui/6.0.1/firebase-ui-auth.css
    return (
        <style jsx global>
            {`
                /*! Terms: https://developers.google.com/terms */
                @import url(https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap);
                dialog {
                    position: absolute;
                    left: 0;
                    right: 0;
                    width: -moz-fit-content;
                    width: -webkit-fit-content;
                    width: fit-content;
                    height: -moz-fit-content;
                    height: -webkit-fit-content;
                    height: fit-content;
                    margin: auto;
                    border: solid;
                    padding: 1em;
                    background: white;
                    color: black;
                    display: none;
                }

                dialog[open] {
                    display: block;
                }

                dialog + .backdrop {
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    background: rgba(0, 0, 0, 0.1);
                }

                /* for small devices, modal dialogs go full-screen */
                @media screen and (max-width: 540px) {
                    dialog[_polyfill_modal] {
                        /* TODO: implement */
                        top: 0;
                        width: auto;
                        margin: 1em;
                    }
                }

                ._dialog_overlay {
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                }
                .mdl-button {
                    background: transparent;
                    border: none;
                    border-radius: 2px;
                    color: rgb(0, 0, 0);
                    position: relative;
                    height: 36px;
                    margin: 0;
                    min-width: 64px;
                    padding: 0 16px;
                    display: inline-block;
                    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    text-transform: uppercase;
                    line-height: 1;
                    letter-spacing: 0;
                    overflow: hidden;
                    will-change: box-shadow;
                    transition: box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1),
                        background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                        color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    outline: none;
                    cursor: pointer;
                    text-decoration: none;
                    text-align: center;
                    line-height: 36px;
                    vertical-align: middle;
                }
                .mdl-button::-moz-focus-inner {
                    border: 0;
                }
                .mdl-button:hover {
                    background-color: rgba(158, 158, 158, 0.2);
                }
                .mdl-button:focus:not(:active) {
                    background-color: rgba(0, 0, 0, 0.12);
                }
                .mdl-button:active {
                    background-color: rgba(158, 158, 158, 0.4);
                }
                .mdl-button.mdl-button--colored {
                    color: rgb(63, 81, 181);
                }
                .mdl-button.mdl-button--colored:focus:not(:active) {
                    background-color: rgba(0, 0, 0, 0.12);
                }
                input.mdl-button[type="submit"] {
                    -webkit-appearance: none;
                }
                .mdl-button--raised {
                    background: rgba(158, 158, 158, 0.2);
                    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                        0 3px 1px -2px rgba(0, 0, 0, 0.2),
                        0 1px 5px 0 rgba(0, 0, 0, 0.12);
                }
                .mdl-button--raised:active {
                    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
                        0 1px 10px 0 rgba(0, 0, 0, 0.12),
                        0 2px 4px -1px rgba(0, 0, 0, 0.2);
                    background-color: rgba(158, 158, 158, 0.4);
                }
                .mdl-button--raised:focus:not(:active) {
                    box-shadow: 0 0 8px rgba(0, 0, 0, 0.18),
                        0 8px 16px rgba(0, 0, 0, 0.36);
                    background-color: rgba(158, 158, 158, 0.4);
                }
                .mdl-button--raised.mdl-button--colored {
                    background: rgb(63, 81, 181);
                    color: rgb(255, 255, 255);
                }
                .mdl-button--raised.mdl-button--colored:hover {
                    background-color: rgb(63, 81, 181);
                }
                .mdl-button--raised.mdl-button--colored:active {
                    background-color: rgb(63, 81, 181);
                }
                .mdl-button--raised.mdl-button--colored:focus:not(:active) {
                    background-color: rgb(63, 81, 181);
                }
                .mdl-button--raised.mdl-button--colored .mdl-ripple {
                    background: rgb(255, 255, 255);
                }
                .mdl-button--fab {
                    border-radius: 50%;
                    font-size: 24px;
                    height: 56px;
                    margin: auto;
                    min-width: 56px;
                    width: 56px;
                    padding: 0;
                    overflow: hidden;
                    background: rgba(158, 158, 158, 0.2);
                    box-shadow: 0 1px 1.5px 0 rgba(0, 0, 0, 0.12),
                        0 1px 1px 0 rgba(0, 0, 0, 0.24);
                    position: relative;
                    line-height: normal;
                }
                .mdl-button--fab .material-icons {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-12px, -12px);
                    line-height: 24px;
                    width: 24px;
                }
                .mdl-button--fab.mdl-button--mini-fab {
                    height: 40px;
                    min-width: 40px;
                    width: 40px;
                }
                .mdl-button--fab .mdl-button__ripple-container {
                    border-radius: 50%;
                    -webkit-mask-image: -webkit-radial-gradient(
                        circle,
                        white,
                        black
                    );
                }
                .mdl-button--fab:active {
                    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
                        0 1px 10px 0 rgba(0, 0, 0, 0.12),
                        0 2px 4px -1px rgba(0, 0, 0, 0.2);
                    background-color: rgba(158, 158, 158, 0.4);
                }
                .mdl-button--fab:focus:not(:active) {
                    box-shadow: 0 0 8px rgba(0, 0, 0, 0.18),
                        0 8px 16px rgba(0, 0, 0, 0.36);
                    background-color: rgba(158, 158, 158, 0.4);
                }
                .mdl-button--fab.mdl-button--colored {
                    background: rgb(255, 64, 129);
                    color: rgb(255, 255, 255);
                }
                .mdl-button--fab.mdl-button--colored:hover {
                    background-color: rgb(255, 64, 129);
                }
                .mdl-button--fab.mdl-button--colored:focus:not(:active) {
                    background-color: rgb(255, 64, 129);
                }
                .mdl-button--fab.mdl-button--colored:active {
                    background-color: rgb(255, 64, 129);
                }
                .mdl-button--fab.mdl-button--colored .mdl-ripple {
                    background: rgb(255, 255, 255);
                }
                .mdl-button--icon {
                    border-radius: 50%;
                    font-size: 24px;
                    height: 32px;
                    margin-left: 0;
                    margin-right: 0;
                    min-width: 32px;
                    width: 32px;
                    padding: 0;
                    overflow: hidden;
                    color: inherit;
                    line-height: normal;
                }
                .mdl-button--icon .material-icons {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-12px, -12px);
                    line-height: 24px;
                    width: 24px;
                }
                .mdl-button--icon.mdl-button--mini-icon {
                    height: 24px;
                    min-width: 24px;
                    width: 24px;
                }
                .mdl-button--icon.mdl-button--mini-icon .material-icons {
                    top: 0px;
                    left: 0px;
                }
                .mdl-button--icon .mdl-button__ripple-container {
                    border-radius: 50%;
                    -webkit-mask-image: -webkit-radial-gradient(
                        circle,
                        white,
                        black
                    );
                }
                .mdl-button__ripple-container {
                    display: block;
                    height: 100%;
                    left: 0px;
                    position: absolute;
                    top: 0px;
                    width: 100%;
                    z-index: 0;
                    overflow: hidden;
                }
                .mdl-button[disabled] .mdl-button__ripple-container .mdl-ripple,
                .mdl-button.mdl-button--disabled
                    .mdl-button__ripple-container
                    .mdl-ripple {
                    background-color: transparent;
                }
                .mdl-button--primary.mdl-button--primary {
                    color: rgb(63, 81, 181);
                }
                .mdl-button--primary.mdl-button--primary .mdl-ripple {
                    background: rgb(255, 255, 255);
                }
                .mdl-button--primary.mdl-button--primary.mdl-button--raised,
                .mdl-button--primary.mdl-button--primary.mdl-button--fab {
                    color: rgb(255, 255, 255);
                    background-color: rgb(63, 81, 181);
                }
                .mdl-button--accent.mdl-button--accent {
                    color: rgb(255, 64, 129);
                }
                .mdl-button--accent.mdl-button--accent .mdl-ripple {
                    background: rgb(255, 255, 255);
                }
                .mdl-button--accent.mdl-button--accent.mdl-button--raised,
                .mdl-button--accent.mdl-button--accent.mdl-button--fab {
                    color: rgb(255, 255, 255);
                    background-color: rgb(255, 64, 129);
                }
                .mdl-button[disabled][disabled],
                .mdl-button.mdl-button--disabled.mdl-button--disabled {
                    color: rgba(0, 0, 0, 0.26);
                    cursor: default;
                    background-color: transparent;
                }
                .mdl-button--fab[disabled][disabled],
                .mdl-button--fab.mdl-button--disabled.mdl-button--disabled {
                    background-color: rgba(0, 0, 0, 0.12);
                    color: rgba(0, 0, 0, 0.26);
                }
                .mdl-button--raised[disabled][disabled],
                .mdl-button--raised.mdl-button--disabled.mdl-button--disabled {
                    background-color: rgba(0, 0, 0, 0.12);
                    color: rgba(0, 0, 0, 0.26);
                    box-shadow: none;
                }
                .mdl-button--colored[disabled][disabled],
                .mdl-button--colored.mdl-button--disabled.mdl-button--disabled {
                    color: rgba(0, 0, 0, 0.26);
                }
                .mdl-button .material-icons {
                    vertical-align: middle;
                }
                .mdl-card {
                    display: flex;
                    flex-direction: column;
                    font-size: 16px;
                    font-weight: 400;
                    min-height: 200px;
                    overflow: hidden;
                    width: 330px;
                    z-index: 1;
                    position: relative;
                    background: rgb(255, 255, 255);
                    border-radius: 2px;
                    box-sizing: border-box;
                }
                .mdl-card__media {
                    background-color: rgb(255, 64, 129);
                    background-repeat: repeat;
                    background-position: 50% 50%;
                    background-size: cover;
                    background-origin: padding-box;
                    background-attachment: scroll;
                    box-sizing: border-box;
                }
                .mdl-card__title {
                    align-items: center;
                    color: rgb(0, 0, 0);
                    display: block;
                    display: flex;
                    justify-content: stretch;
                    line-height: normal;
                    padding: 16px 16px;
                    perspective-origin: 165px 56px;
                    transform-origin: 165px 56px;
                    box-sizing: border-box;
                }
                .mdl-card__title.mdl-card--border {
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                }
                .mdl-card__title-text {
                    align-self: flex-end;
                    color: inherit;
                    display: block;
                    display: flex;
                    font-size: 24px;
                    font-weight: 300;
                    line-height: normal;
                    overflow: hidden;
                    transform-origin: 149px 48px;
                    margin: 0;
                }
                .mdl-card__subtitle-text {
                    font-size: 14px;
                    color: rgba(0, 0, 0, 0.54);
                    margin: 0;
                }
                .mdl-card__supporting-text {
                    color: rgba(0, 0, 0, 0.54);
                    font-size: 1rem;
                    line-height: 18px;
                    overflow: hidden;
                    padding: 16px 16px;
                    width: 90%;
                }
                .mdl-card__supporting-text.mdl-card--border {
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                }
                .mdl-card__actions {
                    font-size: 16px;
                    line-height: normal;
                    width: 100%;
                    background-color: rgba(0, 0, 0, 0);
                    padding: 8px;
                    box-sizing: border-box;
                }
                .mdl-card__actions.mdl-card--border {
                    border-top: 1px solid rgba(0, 0, 0, 0.1);
                }
                .mdl-card--expand {
                    flex-grow: 1;
                }
                .mdl-card__menu {
                    position: absolute;
                    right: 16px;
                    top: 16px;
                }
                .mdl-dialog {
                    border: none;
                    box-shadow: 0 9px 46px 8px rgba(0, 0, 0, 0.14),
                        0 11px 15px -7px rgba(0, 0, 0, 0.12),
                        0 24px 38px 3px rgba(0, 0, 0, 0.2);
                    width: 280px;
                }
                .mdl-dialog__title {
                    padding: 24px 24px 0;
                    margin: 0;
                    font-size: 2.5rem;
                }
                .mdl-dialog__actions {
                    padding: 8px 8px 8px 24px;
                    display: flex;
                    flex-direction: row-reverse;
                    flex-wrap: wrap;
                }
                .mdl-dialog__actions > * {
                    margin-right: 8px;
                    height: 36px;
                }
                .mdl-dialog__actions > *:first-child {
                    margin-right: 0;
                }
                .mdl-dialog__actions--full-width {
                    padding: 0 0 8px 0;
                }
                .mdl-dialog__actions--full-width > * {
                    height: 48px;
                    flex: 0 0 100%;
                    padding-right: 16px;
                    margin-right: 0;
                    text-align: right;
                }
                .mdl-dialog__content {
                    padding: 20px 24px 24px 24px;
                    color: rgba(0, 0, 0, 0.54);
                }
                .mdl-progress {
                    display: block;
                    position: relative;
                    height: 4px;
                    width: 500px;
                    max-width: 100%;
                }
                .mdl-progress > .bar {
                    display: block;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 0%;
                    transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .mdl-progress > .progressbar {
                    background-color: rgb(63, 81, 181);
                    z-index: 1;
                    left: 0;
                }
                .mdl-progress > .bufferbar {
                    background-image: linear-gradient(
                            to right,
                            rgba(255, 255, 255, 0.7),
                            rgba(255, 255, 255, 0.7)
                        ),
                        linear-gradient(
                            to right,
                            rgb(63, 81, 181),
                            rgb(63, 81, 181)
                        );
                    z-index: 0;
                    left: 0;
                }
                .mdl-progress > .auxbar {
                    right: 0;
                }
                @supports (-webkit-appearance: none) {
                    .mdl-progress:not(.mdl-progress--indeterminate):not(
                            .mdl-progress--indeterminate
                        )
                        > .auxbar,
                    .mdl-progress:not(.mdl-progress__indeterminate):not(
                            .mdl-progress__indeterminate
                        )
                        > .auxbar {
                        background-image: linear-gradient(
                                to right,
                                rgba(255, 255, 255, 0.7),
                                rgba(255, 255, 255, 0.7)
                            ),
                            linear-gradient(
                                to right,
                                rgb(63, 81, 181),
                                rgb(63, 81, 181)
                            );
                        mask: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjEyIiBoZWlnaHQ9IjQiIHZpZXdQb3J0PSIwIDAgMTIgNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxlbGxpcHNlIGN4PSIyIiBjeT0iMiIgcng9IjIiIHJ5PSIyIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImN4IiBmcm9tPSIyIiB0bz0iLTEwIiBkdXI9IjAuNnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogIDwvZWxsaXBzZT4KICA8ZWxsaXBzZSBjeD0iMTQiIGN5PSIyIiByeD0iMiIgcnk9IjIiIGNsYXNzPSJsb2FkZXIiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjE0IiB0bz0iMiIgZHVyPSIwLjZzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICA8L2VsbGlwc2U+Cjwvc3ZnPgo=");
                    }
                }
                .mdl-progress:not(.mdl-progress--indeterminate) > .auxbar,
                .mdl-progress:not(.mdl-progress__indeterminate) > .auxbar {
                    background-image: linear-gradient(
                            to right,
                            rgba(255, 255, 255, 0.9),
                            rgba(255, 255, 255, 0.9)
                        ),
                        linear-gradient(
                            to right,
                            rgb(63, 81, 181),
                            rgb(63, 81, 181)
                        );
                }
                .mdl-progress.mdl-progress--indeterminate > .bar1,
                .mdl-progress.mdl-progress__indeterminate > .bar1 {
                    background-color: rgb(63, 81, 181);
                    animation-name: indeterminate1;
                    animation-duration: 2s;
                    animation-iteration-count: infinite;
                    animation-timing-function: linear;
                }
                .mdl-progress.mdl-progress--indeterminate > .bar3,
                .mdl-progress.mdl-progress__indeterminate > .bar3 {
                    background-image: none;
                    background-color: rgb(63, 81, 181);
                    animation-name: indeterminate2;
                    animation-duration: 2s;
                    animation-iteration-count: infinite;
                    animation-timing-function: linear;
                }
                @keyframes indeterminate1 {
                    0% {
                        left: 0%;
                        width: 0%;
                    }
                    50% {
                        left: 25%;
                        width: 75%;
                    }
                    75% {
                        left: 100%;
                        width: 0%;
                    }
                }
                @keyframes indeterminate2 {
                    0% {
                        left: 0%;
                        width: 0%;
                    }
                    50% {
                        left: 0%;
                        width: 0%;
                    }
                    75% {
                        left: 0%;
                        width: 25%;
                    }
                    100% {
                        left: 100%;
                        width: 0%;
                    }
                }
                .mdl-shadow--2dp {
                    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                        0 3px 1px -2px rgba(0, 0, 0, 0.2),
                        0 1px 5px 0 rgba(0, 0, 0, 0.12);
                }
                .mdl-shadow--3dp {
                    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14),
                        0 3px 3px -2px rgba(0, 0, 0, 0.2),
                        0 1px 8px 0 rgba(0, 0, 0, 0.12);
                }
                .mdl-shadow--4dp {
                    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
                        0 1px 10px 0 rgba(0, 0, 0, 0.12),
                        0 2px 4px -1px rgba(0, 0, 0, 0.2);
                }
                .mdl-shadow--6dp {
                    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14),
                        0 1px 18px 0 rgba(0, 0, 0, 0.12),
                        0 3px 5px -1px rgba(0, 0, 0, 0.2);
                }
                .mdl-shadow--8dp {
                    box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
                        0 3px 14px 2px rgba(0, 0, 0, 0.12),
                        0 5px 5px -3px rgba(0, 0, 0, 0.2);
                }
                .mdl-shadow--16dp {
                    box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14),
                        0 6px 30px 5px rgba(0, 0, 0, 0.12),
                        0 8px 10px -5px rgba(0, 0, 0, 0.2);
                }
                .mdl-shadow--24dp {
                    box-shadow: 0 9px 46px 8px rgba(0, 0, 0, 0.14),
                        0 11px 15px -7px rgba(0, 0, 0, 0.12),
                        0 24px 38px 3px rgba(0, 0, 0, 0.2);
                }
                .mdl-spinner {
                    display: inline-block;
                    position: relative;
                    width: 28px;
                    height: 28px;
                }
                .mdl-spinner:not(.is-upgraded).is-active:after {
                    content: "Loading...";
                }
                .mdl-spinner.is-upgraded.is-active {
                    animation: mdl-spinner__container-rotate 1568.2352941176ms
                        linear infinite;
                }
                @keyframes mdl-spinner__container-rotate {
                    to {
                        transform: rotate(360deg);
                    }
                }
                .mdl-spinner__layer {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                }
                .mdl-spinner__layer-1 {
                    border-color: rgb(66, 165, 245);
                }
                .mdl-spinner--single-color .mdl-spinner__layer-1 {
                    border-color: rgb(63, 81, 181);
                }
                .mdl-spinner.is-active .mdl-spinner__layer-1 {
                    animation: mdl-spinner__fill-unfill-rotate 5332ms
                            cubic-bezier(0.4, 0, 0.2, 1) infinite both,
                        mdl-spinner__layer-1-fade-in-out 5332ms
                            cubic-bezier(0.4, 0, 0.2, 1) infinite both;
                }
                .mdl-spinner__layer-2 {
                    border-color: rgb(244, 67, 54);
                }
                .mdl-spinner--single-color .mdl-spinner__layer-2 {
                    border-color: rgb(63, 81, 181);
                }
                .mdl-spinner.is-active .mdl-spinner__layer-2 {
                    animation: mdl-spinner__fill-unfill-rotate 5332ms
                            cubic-bezier(0.4, 0, 0.2, 1) infinite both,
                        mdl-spinner__layer-2-fade-in-out 5332ms
                            cubic-bezier(0.4, 0, 0.2, 1) infinite both;
                }
                .mdl-spinner__layer-3 {
                    border-color: rgb(253, 216, 53);
                }
                .mdl-spinner--single-color .mdl-spinner__layer-3 {
                    border-color: rgb(63, 81, 181);
                }
                .mdl-spinner.is-active .mdl-spinner__layer-3 {
                    animation: mdl-spinner__fill-unfill-rotate 5332ms
                            cubic-bezier(0.4, 0, 0.2, 1) infinite both,
                        mdl-spinner__layer-3-fade-in-out 5332ms
                            cubic-bezier(0.4, 0, 0.2, 1) infinite both;
                }
                .mdl-spinner__layer-4 {
                    border-color: rgb(76, 175, 80);
                }
                .mdl-spinner--single-color .mdl-spinner__layer-4 {
                    border-color: rgb(63, 81, 181);
                }
                .mdl-spinner.is-active .mdl-spinner__layer-4 {
                    animation: mdl-spinner__fill-unfill-rotate 5332ms
                            cubic-bezier(0.4, 0, 0.2, 1) infinite both,
                        mdl-spinner__layer-4-fade-in-out 5332ms
                            cubic-bezier(0.4, 0, 0.2, 1) infinite both;
                }
                @keyframes mdl-spinner__fill-unfill-rotate {
                    12.5% {
                        transform: rotate(135deg);
                    }
                    25% {
                        transform: rotate(270deg);
                    }
                    37.5% {
                        transform: rotate(405deg);
                    }
                    50% {
                        transform: rotate(540deg);
                    }
                    62.5% {
                        transform: rotate(675deg);
                    }
                    75% {
                        transform: rotate(810deg);
                    }
                    87.5% {
                        transform: rotate(945deg);
                    }
                    to {
                        transform: rotate(1080deg);
                    }
                }
                @keyframes mdl-spinner__layer-1-fade-in-out {
                    from {
                        opacity: 0.99;
                    }
                    25% {
                        opacity: 0.99;
                    }
                    26% {
                        opacity: 0;
                    }
                    89% {
                        opacity: 0;
                    }
                    90% {
                        opacity: 0.99;
                    }
                    100% {
                        opacity: 0.99;
                    }
                }
                @keyframes mdl-spinner__layer-2-fade-in-out {
                    from {
                        opacity: 0;
                    }
                    15% {
                        opacity: 0;
                    }
                    25% {
                        opacity: 0.99;
                    }
                    50% {
                        opacity: 0.99;
                    }
                    51% {
                        opacity: 0;
                    }
                }
                @keyframes mdl-spinner__layer-3-fade-in-out {
                    from {
                        opacity: 0;
                    }
                    40% {
                        opacity: 0;
                    }
                    50% {
                        opacity: 0.99;
                    }
                    75% {
                        opacity: 0.99;
                    }
                    76% {
                        opacity: 0;
                    }
                }
                @keyframes mdl-spinner__layer-4-fade-in-out {
                    from {
                        opacity: 0;
                    }
                    65% {
                        opacity: 0;
                    }
                    75% {
                        opacity: 0.99;
                    }
                    90% {
                        opacity: 0.99;
                    }
                    100% {
                        opacity: 0;
                    }
                }
                .mdl-spinner__gap-patch {
                    position: absolute;
                    box-sizing: border-box;
                    top: 0;
                    left: 45%;
                    width: 10%;
                    height: 100%;
                    overflow: hidden;
                    border-color: inherit;
                }
                .mdl-spinner__gap-patch .mdl-spinner__circle {
                    width: 1000%;
                    left: -450%;
                }
                .mdl-spinner__circle-clipper {
                    display: inline-block;
                    position: relative;
                    width: 50%;
                    height: 100%;
                    overflow: hidden;
                    border-color: inherit;
                }
                .mdl-spinner__circle-clipper.mdl-spinner__left {
                    float: left;
                }
                .mdl-spinner__circle-clipper.mdl-spinner__right {
                    float: right;
                }
                .mdl-spinner__circle-clipper .mdl-spinner__circle {
                    width: 200%;
                }
                .mdl-spinner__circle {
                    box-sizing: border-box;
                    height: 100%;
                    border-width: 3px;
                    border-style: solid;
                    border-color: inherit;
                    border-bottom-color: transparent !important;
                    border-radius: 50%;
                    animation: none;
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                }
                .mdl-spinner__left .mdl-spinner__circle {
                    border-right-color: transparent !important;
                    transform: rotate(129deg);
                }
                .mdl-spinner.is-active .mdl-spinner__left .mdl-spinner__circle {
                    animation: mdl-spinner__left-spin 1333ms
                        cubic-bezier(0.4, 0, 0.2, 1) infinite both;
                }
                .mdl-spinner__right .mdl-spinner__circle {
                    left: -100%;
                    border-left-color: transparent !important;
                    transform: rotate(-129deg);
                }
                .mdl-spinner.is-active
                    .mdl-spinner__right
                    .mdl-spinner__circle {
                    animation: mdl-spinner__right-spin 1333ms
                        cubic-bezier(0.4, 0, 0.2, 1) infinite both;
                }
                @keyframes mdl-spinner__left-spin {
                    from {
                        transform: rotate(130deg);
                    }
                    50% {
                        transform: rotate(-5deg);
                    }
                    to {
                        transform: rotate(130deg);
                    }
                }
                @keyframes mdl-spinner__right-spin {
                    from {
                        transform: rotate(-130deg);
                    }
                    50% {
                        transform: rotate(5deg);
                    }
                    to {
                        transform: rotate(-130deg);
                    }
                }
                .mdl-textfield {
                    position: relative;
                    font-size: 16px;
                    display: inline-block;
                    box-sizing: border-box;
                    width: 300px;
                    max-width: 100%;
                    margin: 0;
                    padding: 20px 0;
                }
                .mdl-textfield .mdl-button {
                    position: absolute;
                    bottom: 20px;
                }
                .mdl-textfield--align-right {
                    text-align: right;
                }
                .mdl-textfield--full-width {
                    width: 100%;
                }
                .mdl-textfield--expandable {
                    min-width: 32px;
                    width: auto;
                    min-height: 32px;
                }
                .mdl-textfield--expandable .mdl-button--icon {
                    top: 16px;
                }
                .mdl-textfield__input {
                    border: none;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
                    display: block;
                    font-size: 16px;
                    font-family: "Helvetica", "Arial", sans-serif;
                    margin: 0;
                    padding: 4px 0;
                    width: 100%;
                    background: none;
                    text-align: left;
                    color: inherit;
                }
                .mdl-textfield__input[type="number"] {
                    -moz-appearance: textfield;
                }
                .mdl-textfield__input[type="number"]::-webkit-inner-spin-button,
                .mdl-textfield__input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                .mdl-textfield.is-focused .mdl-textfield__input {
                    outline: none;
                }
                .mdl-textfield.is-invalid .mdl-textfield__input {
                    border-color: rgb(213, 0, 0);
                    box-shadow: none;
                }
                fieldset[disabled] .mdl-textfield .mdl-textfield__input,
                .mdl-textfield.is-disabled .mdl-textfield__input {
                    background-color: transparent;
                    border-bottom: 1px dotted rgba(0, 0, 0, 0.12);
                    color: rgba(0, 0, 0, 0.26);
                }
                .mdl-textfield textarea.mdl-textfield__input {
                    display: block;
                }
                .mdl-textfield__label {
                    bottom: 0;
                    color: rgba(0, 0, 0, 0.26);
                    font-size: 16px;
                    left: 0;
                    right: 0;
                    pointer-events: none;
                    position: absolute;
                    display: block;
                    top: 24px;
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-align: left;
                }
                .mdl-textfield.is-dirty .mdl-textfield__label,
                .mdl-textfield.has-placeholder .mdl-textfield__label {
                    visibility: hidden;
                }
                .mdl-textfield--floating-label .mdl-textfield__label {
                    transition-duration: 0.2s;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                }
                .mdl-textfield--floating-label.has-placeholder
                    .mdl-textfield__label {
                    transition: none;
                }
                fieldset[disabled] .mdl-textfield .mdl-textfield__label,
                .mdl-textfield.is-disabled.is-disabled .mdl-textfield__label {
                    color: rgba(0, 0, 0, 0.26);
                }
                .mdl-textfield--floating-label.is-focused .mdl-textfield__label,
                .mdl-textfield--floating-label.is-dirty .mdl-textfield__label,
                .mdl-textfield--floating-label.has-placeholder
                    .mdl-textfield__label {
                    color: rgb(63, 81, 181);
                    font-size: 12px;
                    top: 4px;
                    visibility: visible;
                }
                .mdl-textfield--floating-label.is-focused
                    .mdl-textfield__expandable-holder
                    .mdl-textfield__label,
                .mdl-textfield--floating-label.is-dirty
                    .mdl-textfield__expandable-holder
                    .mdl-textfield__label,
                .mdl-textfield--floating-label.has-placeholder
                    .mdl-textfield__expandable-holder
                    .mdl-textfield__label {
                    top: -16px;
                }
                .mdl-textfield--floating-label.is-invalid
                    .mdl-textfield__label {
                    color: rgb(213, 0, 0);
                    font-size: 12px;
                }
                .mdl-textfield__label:after {
                    background-color: rgb(63, 81, 181);
                    bottom: 20px;
                    content: "";
                    height: 2px;
                    left: 45%;
                    position: absolute;
                    transition-duration: 0.2s;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    visibility: hidden;
                    width: 10px;
                }
                .mdl-textfield.is-focused .mdl-textfield__label:after {
                    left: 0;
                    visibility: visible;
                    width: 100%;
                }
                .mdl-textfield.is-invalid .mdl-textfield__label:after {
                    background-color: rgb(213, 0, 0);
                }
                .mdl-textfield__error {
                    color: rgb(213, 0, 0);
                    position: absolute;
                    font-size: 12px;
                    margin-top: 3px;
                    visibility: hidden;
                    display: block;
                }
                .mdl-textfield.is-invalid .mdl-textfield__error {
                    visibility: visible;
                }
                .mdl-textfield__expandable-holder {
                    display: inline-block;
                    position: relative;
                    margin-left: 32px;
                    transition-duration: 0.2s;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    display: inline-block;
                    max-width: 0.1px;
                }
                .mdl-textfield.is-focused .mdl-textfield__expandable-holder,
                .mdl-textfield.is-dirty .mdl-textfield__expandable-holder {
                    max-width: 600px;
                }
                .mdl-textfield__expandable-holder .mdl-textfield__label:after {
                    bottom: 0;
                }
                .firebaseui-container {
                    background-color: #fff;
                    box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    -webkit-box-sizing: border-box;
                    color: rgba(0, 0, 0, 0.87);
                    direction: ltr;
                    font: 16px Roboto, arial, sans-serif;
                    margin: 0 auto;
                    max-width: 360px;
                    overflow: visible;
                    position: relative;
                    text-align: left;
                    width: 100%;
                }
                .firebaseui-container.mdl-card {
                    overflow: visible;
                }
                .firebaseui-card-header {
                    padding: 24px 24px 0 24px;
                }
                .firebaseui-card-content {
                    padding: 0 24px;
                }
                .firebaseui-card-footer {
                    padding: 0 24px;
                }
                .firebaseui-card-actions {
                    box-sizing: border-box;
                    display: table;
                    font-size: 14px;
                    padding: 8px 24px 24px 24px;
                    text-align: left;
                    width: 100%;
                }
                .firebaseui-form-links {
                    display: table-cell;
                    vertical-align: middle;
                    width: 100%;
                }
                .firebaseui-form-actions {
                    display: table-cell;
                    text-align: right;
                    white-space: nowrap;
                    width: 100%;
                }
                .firebaseui-title,
                .firebaseui-subtitle {
                    color: rgba(0, 0, 0, 0.87);
                    direction: ltr;
                    font-size: 20px;
                    font-weight: 500;
                    line-height: 24px;
                    margin: 0;
                    padding: 0;
                    text-align: left;
                }
                .firebaseui-title {
                    padding-bottom: 16px;
                }
                .firebaseui-subtitle {
                    margin: 16px 0;
                }
                .firebaseui-text {
                    color: rgba(0, 0, 0, 0.87);
                    direction: ltr;
                    font-size: 16px;
                    line-height: 24px;
                    text-align: left;
                }
                .firebaseui-id-page-password-recovery-email-sent
                    p.firebaseui-text {
                    margin: 16px 0;
                }
                .firebaseui-text-emphasis {
                    font-weight: 700;
                }
                .firebaseui-error {
                    color: #dd2c00;
                    direction: ltr;
                    font-size: 12px;
                    line-height: 16px;
                    margin: 0;
                    text-align: left;
                }
                .firebaseui-text-input-error {
                    margin: -16px 0 16px;
                }
                .firebaseui-error-wrapper {
                    min-height: 16px;
                }
                .firebaseui-list-item {
                    direction: ltr;
                    margin: 0;
                    padding: 0;
                    text-align: left;
                }
                .firebaseui-hidden {
                    display: none;
                }
                .firebaseui-relative-wrapper {
                    position: relative;
                }
                .firebaseui-label {
                    color: rgba(0, 0, 0, 0.54);
                    direction: ltr;
                    font-size: 16px;
                    text-align: left;
                }
                .mdl-textfield--floating-label.is-focused .mdl-textfield__label,
                .mdl-textfield--floating-label.is-dirty .mdl-textfield__label {
                    color: #757575;
                }
                .firebaseui-input,
                .firebaseui-input-invalid {
                    border-radius: 0;
                    color: rgba(0, 0, 0, 0.87);
                    direction: ltr;
                    font-size: 16px;
                    width: 100%;
                }
                input.firebaseui-input,
                input.firebaseui-input-invalid {
                    direction: ltr;
                    text-align: left;
                }
                .firebaseui-input-invalid {
                    border-color: #dd2c00;
                }
                .firebaseui-textfield {
                    width: 100%;
                }
                .firebaseui-textfield.mdl-textfield .firebaseui-input {
                    border-color: rgba(0, 0, 0, 0.12);
                }
                .firebaseui-textfield.mdl-textfield .firebaseui-label::after {
                    background-color: #3f51b5;
                }
                .firebaseui-textfield-invalid.mdl-textfield .firebaseui-input {
                    border-color: #dd2c00;
                }
                .firebaseui-textfield-invalid.mdl-textfield
                    .firebaseui-label::after {
                    background-color: #dd2c00;
                }
                .firebaseui-button {
                    display: inline-block;
                    height: 36px;
                    margin-left: 8px;
                    min-width: 88px;
                }
                .firebaseui-link {
                    color: #4285f4;
                    font-variant: normal;
                    font-weight: normal;
                    text-decoration: none;
                }
                .firebaseui-link:hover {
                    text-decoration: underline;
                }
                .firebaseui-indent {
                    margin-left: 1em;
                }
                .firebaseui-tos {
                    color: #757575;
                    direction: ltr;
                    font-size: 12px;
                    line-height: 16px;
                    margin-bottom: 24px;
                    margin-top: 0;
                    text-align: left;
                }
                .firebaseui-provider-sign-in-footer > .firebaseui-tos {
                    text-align: center;
                }
                .firebaseui-tos-list {
                    list-style: none;
                    text-align: right;
                }
                .firebaseui-inline-list-item {
                    display: inline-block;
                    margin-left: 5px;
                    margin-right: 5px;
                }
                .firebaseui-page-provider-sign-in,
                .firebaseui-page-select-tenant {
                    background: inherit;
                }
                .firebaseui-idp-list,
                .firebaseui-tenant-list {
                    list-style: none;
                    margin: 1em 0;
                    padding: 0;
                }
                .firebaseui-idp-button,
                .firebaseui-tenant-button {
                    direction: ltr;
                    font-weight: 500;
                    height: auto;
                    line-height: normal;
                    max-width: 220px;
                    min-height: 40px;
                    padding: 8px 16px;
                    text-align: left;
                    width: 100%;
                }
                .firebaseui-idp-list > .firebaseui-list-item,
                .firebaseui-tenant-list > .firebaseui-list-item {
                    margin-bottom: 15px;
                    text-align: center;
                }
                .firebaseui-idp-icon-wrapper {
                    display: table-cell;
                    vertical-align: middle;
                }
                .firebaseui-idp-icon {
                    border: none;
                    display: inline-block;
                    height: 18px;
                    vertical-align: middle;
                    width: 18px;
                }
                .firebaseui-idp-favicon {
                    border: none;
                    display: inline-block;
                    height: 14px;
                    margin-right: 5px;
                    vertical-align: middle;
                    width: 14px;
                }
                .firebaseui-idp-text {
                    color: #fff;
                    display: table-cell;
                    font-size: 14px;
                    padding-left: 16px;
                    text-transform: none;
                    vertical-align: middle;
                }
                .firebaseui-idp-text.firebaseui-idp-text-long {
                    display: table-cell;
                }
                .firebaseui-idp-text.firebaseui-idp-text-short {
                    display: none;
                }
                @media (max-width: 268px) {
                    .firebaseui-idp-text.firebaseui-idp-text-long {
                        display: none;
                    }
                    .firebaseui-idp-text.firebaseui-idp-text-short {
                        display: table-cell;
                    }
                }
                @media (max-width: 320px) {
                    .firebaseui-recaptcha-container > div > div {
                        transform: scale(0.9);
                        -webkit-transform: scale(0.9);
                        transform-origin: 0 0;
                        -webkit-transform-origin: 0 0;
                    }
                }
                .firebaseui-idp-google > .firebaseui-idp-text {
                    color: #757575;
                }
                [data-provider-id="yahoo.com"]
                    > .firebaseui-idp-icon-wrapper
                    > .firebaseui-idp-icon {
                    height: 22px;
                    width: 22px;
                }
                .firebaseui-info-bar {
                    background-color: #f9edbe;
                    border: 1px solid #f0c36d;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    -moz-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    left: 10%;
                    padding: 8px 16px;
                    position: absolute;
                    right: 10%;
                    text-align: center;
                    top: 0;
                }
                .firebaseui-info-bar-message {
                    font-size: 12px;
                    margin: 0;
                }
                .firebaseui-dialog {
                    box-sizing: border-box;
                    color: rgba(0, 0, 0, 0.87);
                    font: 16px Roboto, arial, sans-serif;
                    height: auto;
                    max-height: fit-content;
                    padding: 24px;
                    text-align: left;
                }
                .firebaseui-dialog-icon-wrapper {
                    display: table-cell;
                    vertical-align: middle;
                }
                .firebaseui-dialog-icon {
                    float: left;
                    height: 40px;
                    margin-right: 24px;
                    width: 40px;
                }
                .firebaseui-progress-dialog-message {
                    display: table-cell;
                    font-size: 16px;
                    font-weight: 400;
                    min-height: 40px;
                    vertical-align: middle;
                }
                .firebaseui-progress-dialog-loading-icon {
                    height: 28px;
                    margin: 6px 30px 6px 6px;
                    width: 28px;
                }
                .firebaseui-icon-done {
                    background-image: url("https://www.gstatic.com/images/icons/material/system/2x/done_googgreen_36dp.png");
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: 36px 36px;
                }
                .firebaseui-phone-number {
                    display: flex;
                }
                .firebaseui-country-selector {
                    background-image: url("https://www.gstatic.com/images/icons/material/system/1x/arrow_drop_down_grey600_18dp.png");
                    background-position: right center;
                    background-repeat: no-repeat;
                    background-size: 18px auto;
                    border-radius: 0;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
                    color: rgba(0, 0, 0, 0.87);
                    flex-shrink: 0;
                    font-size: 16px;
                    font-weight: normal;
                    height: initial;
                    line-height: normal;
                    margin: 20px 24px 20px 0;
                    padding: 4px 20px 4px 0;
                    width: 90px;
                }
                .firebaseui-country-selector-flag {
                    display: inline-block;
                    margin-right: 1ex;
                }
                .firebaseui-flag {
                    background-image: url("https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/flags_sprite_2x.png");
                    background-size: 100% auto;
                    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.54));
                    height: 14px;
                    width: 24px;
                }
                .firebaseui-list-box-dialog {
                    max-height: 90%;
                    overflow: auto;
                    padding: 8px 0 0 0;
                }
                .firebaseui-list-box-actions {
                    padding-bottom: 8px;
                }
                .firebaseui-list-box-icon-wrapper {
                    display: table-cell;
                    padding-right: 24px;
                    vertical-align: top;
                }
                .firebaseui-list-box-label-wrapper {
                    display: table-cell;
                    vertical-align: top;
                }
                .firebaseui-list-box-dialog-button {
                    color: rgba(0, 0, 0, 0.87);
                    direction: ltr;
                    font-size: 16px;
                    font-weight: normal;
                    height: initial;
                    line-height: normal;
                    min-height: 48px;
                    padding: 14px 24px;
                    text-align: left;
                    text-transform: none;
                    width: 100%;
                }
                .firebaseui-phone-number-error {
                    margin-left: 114px;
                }
                .mdl-progress.firebaseui-busy-indicator {
                    height: 2px;
                    left: 0;
                    position: absolute;
                    top: 55px;
                    width: 100%;
                }
                .mdl-spinner.firebaseui-busy-indicator {
                    direction: initial;
                    height: 56px;
                    left: 0px;
                    margin: auto;
                    position: absolute;
                    right: 0px;
                    top: 30%;
                    width: 56px;
                }
                .firebaseui-callback-indicator-container
                    .firebaseui-busy-indicator {
                    top: 0px;
                }
                .firebaseui-callback-indicator-container {
                    height: 120px;
                }
                .firebaseui-new-password-component {
                    display: inline-block;
                    position: relative;
                    width: 100%;
                }
                .firebaseui-input-floating-button {
                    background-position: center;
                    background-repeat: no-repeat;
                    display: block;
                    height: 24px;
                    position: absolute;
                    right: 0;
                    top: 20px;
                    width: 24px;
                }
                .firebaseui-input-toggle-on {
                    background-image: url("https://www.gstatic.com/images/icons/material/system/1x/visibility_black_24dp.png");
                }
                .firebaseui-input-toggle-off {
                    background-image: url("https://www.gstatic.com/images/icons/material/system/1x/visibility_off_black_24dp.png");
                }
                .firebaseui-input-toggle-focus {
                    opacity: 0.87;
                }
                .firebaseui-input-toggle-blur {
                    opacity: 0.38;
                }
                .firebaseui-recaptcha-wrapper {
                    display: table;
                    margin: 0 auto;
                    padding-bottom: 8px;
                }
                .firebaseui-recaptcha-container {
                    display: table-cell;
                }
                .firebaseui-recaptcha-error-wrapper {
                    caption-side: bottom;
                    display: table-caption;
                }
                .firebaseui-change-phone-number-link {
                    display: block;
                }
                .firebaseui-resend-container {
                    direction: ltr;
                    margin: 20px 0;
                    text-align: center;
                }
                .firebaseui-id-resend-countdown {
                    color: rgba(0, 0, 0, 0.38);
                }
                .firebaseui-id-page-phone-sign-in-start
                    .firebaseui-form-actions
                    div {
                    float: left;
                }
                @media (max-width: 480px) {
                    .firebaseui-container {
                        box-shadow: none;
                        max-width: none;
                        width: 100%;
                    }
                    .firebaseui-card-header {
                        border-bottom: 1px solid #e0e0e0;
                        margin-bottom: 16px;
                        padding: 16px 24px 0 24px;
                    }
                    .firebaseui-title {
                        padding-bottom: 16px;
                    }
                    .firebaseui-card-actions {
                        padding-right: 24px;
                    }
                    .firebaseui-busy-indicator {
                        top: 0px;
                    }
                }
                .mdl-textfield__label {
                    font-weight: normal;
                    margin-bottom: 0;
                }
                .firebaseui-id-page-blank {
                    background: inherit;
                    height: 64px;
                }
                .firebaseui-id-page-spinner {
                    background: inherit;
                    height: 64px;
                }
                .firebaseui-email-sent {
                    background-image: url("https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/success_status.png");
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: 64px 64px;
                    height: 64px;
                    margin-top: 16px;
                    text-align: center;
                }
                .firebaseui-text-justify {
                    text-align: justify;
                }
                .firebaseui-flag-KY {
                    background-position: -0px -0px;
                }
                .firebaseui-flag-AC {
                    background-position: -0px -14px;
                }
                .firebaseui-flag-AE {
                    background-position: -0px -28px;
                }
                .firebaseui-flag-AF {
                    background-position: -0px -42px;
                }
                .firebaseui-flag-AG {
                    background-position: -0px -56px;
                }
                .firebaseui-flag-AI {
                    background-position: -0px -70px;
                }
                .firebaseui-flag-AL {
                    background-position: -0px -84px;
                }
                .firebaseui-flag-AM {
                    background-position: -0px -98px;
                }
                .firebaseui-flag-AO {
                    background-position: -0px -112px;
                }
                .firebaseui-flag-AQ {
                    background-position: -0px -126px;
                }
                .firebaseui-flag-AR {
                    background-position: -0px -140px;
                }
                .firebaseui-flag-AS {
                    background-position: -0px -154px;
                }
                .firebaseui-flag-AT {
                    background-position: -0px -168px;
                }
                .firebaseui-flag-AU {
                    background-position: -0px -182px;
                }
                .firebaseui-flag-AW {
                    background-position: -0px -196px;
                }
                .firebaseui-flag-AX {
                    background-position: -0px -210px;
                }
                .firebaseui-flag-AZ {
                    background-position: -0px -224px;
                }
                .firebaseui-flag-BA {
                    background-position: -0px -238px;
                }
                .firebaseui-flag-BB {
                    background-position: -0px -252px;
                }
                .firebaseui-flag-BD {
                    background-position: -0px -266px;
                }
                .firebaseui-flag-BE {
                    background-position: -0px -280px;
                }
                .firebaseui-flag-BF {
                    background-position: -0px -294px;
                }
                .firebaseui-flag-BG {
                    background-position: -0px -308px;
                }
                .firebaseui-flag-BH {
                    background-position: -0px -322px;
                }
                .firebaseui-flag-BI {
                    background-position: -0px -336px;
                }
                .firebaseui-flag-BJ {
                    background-position: -0px -350px;
                }
                .firebaseui-flag-BL {
                    background-position: -0px -364px;
                }
                .firebaseui-flag-BM {
                    background-position: -0px -378px;
                }
                .firebaseui-flag-BN {
                    background-position: -0px -392px;
                }
                .firebaseui-flag-BO {
                    background-position: -0px -406px;
                }
                .firebaseui-flag-BQ {
                    background-position: -0px -420px;
                }
                .firebaseui-flag-BR {
                    background-position: -0px -434px;
                }
                .firebaseui-flag-BS {
                    background-position: -0px -448px;
                }
                .firebaseui-flag-BT {
                    background-position: -0px -462px;
                }
                .firebaseui-flag-BV {
                    background-position: -0px -476px;
                }
                .firebaseui-flag-BW {
                    background-position: -0px -490px;
                }
                .firebaseui-flag-BY {
                    background-position: -0px -504px;
                }
                .firebaseui-flag-BZ {
                    background-position: -0px -518px;
                }
                .firebaseui-flag-CA {
                    background-position: -0px -532px;
                }
                .firebaseui-flag-CC {
                    background-position: -0px -546px;
                }
                .firebaseui-flag-CD {
                    background-position: -0px -560px;
                }
                .firebaseui-flag-CF {
                    background-position: -0px -574px;
                }
                .firebaseui-flag-CG {
                    background-position: -0px -588px;
                }
                .firebaseui-flag-CH {
                    background-position: -0px -602px;
                }
                .firebaseui-flag-CI {
                    background-position: -0px -616px;
                }
                .firebaseui-flag-CK {
                    background-position: -0px -630px;
                }
                .firebaseui-flag-CL {
                    background-position: -0px -644px;
                }
                .firebaseui-flag-CM {
                    background-position: -0px -658px;
                }
                .firebaseui-flag-CN {
                    background-position: -0px -672px;
                }
                .firebaseui-flag-CO {
                    background-position: -0px -686px;
                }
                .firebaseui-flag-CP {
                    background-position: -0px -700px;
                }
                .firebaseui-flag-CR {
                    background-position: -0px -714px;
                }
                .firebaseui-flag-CU {
                    background-position: -0px -728px;
                }
                .firebaseui-flag-CV {
                    background-position: -0px -742px;
                }
                .firebaseui-flag-CW {
                    background-position: -0px -756px;
                }
                .firebaseui-flag-CX {
                    background-position: -0px -770px;
                }
                .firebaseui-flag-CY {
                    background-position: -0px -784px;
                }
                .firebaseui-flag-CZ {
                    background-position: -0px -798px;
                }
                .firebaseui-flag-DE {
                    background-position: -0px -812px;
                }
                .firebaseui-flag-DG {
                    background-position: -0px -826px;
                }
                .firebaseui-flag-DJ {
                    background-position: -0px -840px;
                }
                .firebaseui-flag-DK {
                    background-position: -0px -854px;
                }
                .firebaseui-flag-DM {
                    background-position: -0px -868px;
                }
                .firebaseui-flag-DO {
                    background-position: -0px -882px;
                }
                .firebaseui-flag-DZ {
                    background-position: -0px -896px;
                }
                .firebaseui-flag-EA {
                    background-position: -0px -910px;
                }
                .firebaseui-flag-EC {
                    background-position: -0px -924px;
                }
                .firebaseui-flag-EE {
                    background-position: -0px -938px;
                }
                .firebaseui-flag-EG {
                    background-position: -0px -952px;
                }
                .firebaseui-flag-EH {
                    background-position: -0px -966px;
                }
                .firebaseui-flag-ER {
                    background-position: -0px -980px;
                }
                .firebaseui-flag-ES {
                    background-position: -0px -994px;
                }
                .firebaseui-flag-ET {
                    background-position: -0px -1008px;
                }
                .firebaseui-flag-EU {
                    background-position: -0px -1022px;
                }
                .firebaseui-flag-FI {
                    background-position: -0px -1036px;
                }
                .firebaseui-flag-FJ {
                    background-position: -0px -1050px;
                }
                .firebaseui-flag-FK {
                    background-position: -0px -1064px;
                }
                .firebaseui-flag-FM {
                    background-position: -0px -1078px;
                }
                .firebaseui-flag-FO {
                    background-position: -0px -1092px;
                }
                .firebaseui-flag-FR {
                    background-position: -0px -1106px;
                }
                .firebaseui-flag-GA {
                    background-position: -0px -1120px;
                }
                .firebaseui-flag-GB {
                    background-position: -0px -1134px;
                }
                .firebaseui-flag-GD {
                    background-position: -0px -1148px;
                }
                .firebaseui-flag-GE {
                    background-position: -0px -1162px;
                }
                .firebaseui-flag-GF {
                    background-position: -0px -1176px;
                }
                .firebaseui-flag-GG {
                    background-position: -0px -1190px;
                }
                .firebaseui-flag-GH {
                    background-position: -0px -1204px;
                }
                .firebaseui-flag-GI {
                    background-position: -0px -1218px;
                }
                .firebaseui-flag-GL {
                    background-position: -0px -1232px;
                }
                .firebaseui-flag-GM {
                    background-position: -0px -1246px;
                }
                .firebaseui-flag-GN {
                    background-position: -0px -1260px;
                }
                .firebaseui-flag-GP {
                    background-position: -0px -1274px;
                }
                .firebaseui-flag-GQ {
                    background-position: -0px -1288px;
                }
                .firebaseui-flag-GR {
                    background-position: -0px -1302px;
                }
                .firebaseui-flag-GS {
                    background-position: -0px -1316px;
                }
                .firebaseui-flag-GT {
                    background-position: -0px -1330px;
                }
                .firebaseui-flag-GU {
                    background-position: -0px -1344px;
                }
                .firebaseui-flag-GW {
                    background-position: -0px -1358px;
                }
                .firebaseui-flag-GY {
                    background-position: -0px -1372px;
                }
                .firebaseui-flag-HK {
                    background-position: -0px -1386px;
                }
                .firebaseui-flag-HM {
                    background-position: -0px -1400px;
                }
                .firebaseui-flag-HN {
                    background-position: -0px -1414px;
                }
                .firebaseui-flag-HR {
                    background-position: -0px -1428px;
                }
                .firebaseui-flag-HT {
                    background-position: -0px -1442px;
                }
                .firebaseui-flag-HU {
                    background-position: -0px -1456px;
                }
                .firebaseui-flag-IC {
                    background-position: -0px -1470px;
                }
                .firebaseui-flag-ID {
                    background-position: -0px -1484px;
                }
                .firebaseui-flag-IE {
                    background-position: -0px -1498px;
                }
                .firebaseui-flag-IL {
                    background-position: -0px -1512px;
                }
                .firebaseui-flag-IM {
                    background-position: -0px -1526px;
                }
                .firebaseui-flag-IN {
                    background-position: -0px -1540px;
                }
                .firebaseui-flag-IO {
                    background-position: -0px -1554px;
                }
                .firebaseui-flag-IQ {
                    background-position: -0px -1568px;
                }
                .firebaseui-flag-IR {
                    background-position: -0px -1582px;
                }
                .firebaseui-flag-IS {
                    background-position: -0px -1596px;
                }
                .firebaseui-flag-IT {
                    background-position: -0px -1610px;
                }
                .firebaseui-flag-JE {
                    background-position: -0px -1624px;
                }
                .firebaseui-flag-JM {
                    background-position: -0px -1638px;
                }
                .firebaseui-flag-JO {
                    background-position: -0px -1652px;
                }
                .firebaseui-flag-JP {
                    background-position: -0px -1666px;
                }
                .firebaseui-flag-KE {
                    background-position: -0px -1680px;
                }
                .firebaseui-flag-KG {
                    background-position: -0px -1694px;
                }
                .firebaseui-flag-KH {
                    background-position: -0px -1708px;
                }
                .firebaseui-flag-KI {
                    background-position: -0px -1722px;
                }
                .firebaseui-flag-KM {
                    background-position: -0px -1736px;
                }
                .firebaseui-flag-KN {
                    background-position: -0px -1750px;
                }
                .firebaseui-flag-KP {
                    background-position: -0px -1764px;
                }
                .firebaseui-flag-KR {
                    background-position: -0px -1778px;
                }
                .firebaseui-flag-KW {
                    background-position: -0px -1792px;
                }
                .firebaseui-flag-AD {
                    background-position: -0px -1806px;
                }
                .firebaseui-flag-KZ {
                    background-position: -0px -1820px;
                }
                .firebaseui-flag-LA {
                    background-position: -0px -1834px;
                }
                .firebaseui-flag-LB {
                    background-position: -0px -1848px;
                }
                .firebaseui-flag-LC {
                    background-position: -0px -1862px;
                }
                .firebaseui-flag-LI {
                    background-position: -0px -1876px;
                }
                .firebaseui-flag-LK {
                    background-position: -0px -1890px;
                }
                .firebaseui-flag-LR {
                    background-position: -0px -1904px;
                }
                .firebaseui-flag-LS {
                    background-position: -0px -1918px;
                }
                .firebaseui-flag-LT {
                    background-position: -0px -1932px;
                }
                .firebaseui-flag-LU {
                    background-position: -0px -1946px;
                }
                .firebaseui-flag-LV {
                    background-position: -0px -1960px;
                }
                .firebaseui-flag-LY {
                    background-position: -0px -1974px;
                }
                .firebaseui-flag-MA {
                    background-position: -0px -1988px;
                }
                .firebaseui-flag-MC {
                    background-position: -0px -2002px;
                }
                .firebaseui-flag-MD {
                    background-position: -0px -2016px;
                }
                .firebaseui-flag-ME {
                    background-position: -0px -2030px;
                }
                .firebaseui-flag-MF {
                    background-position: -0px -2044px;
                }
                .firebaseui-flag-MG {
                    background-position: -0px -2058px;
                }
                .firebaseui-flag-MH {
                    background-position: -0px -2072px;
                }
                .firebaseui-flag-MK {
                    background-position: -0px -2086px;
                }
                .firebaseui-flag-ML {
                    background-position: -0px -2100px;
                }
                .firebaseui-flag-MM {
                    background-position: -0px -2114px;
                }
                .firebaseui-flag-MN {
                    background-position: -0px -2128px;
                }
                .firebaseui-flag-MO {
                    background-position: -0px -2142px;
                }
                .firebaseui-flag-MP {
                    background-position: -0px -2156px;
                }
                .firebaseui-flag-MQ {
                    background-position: -0px -2170px;
                }
                .firebaseui-flag-MR {
                    background-position: -0px -2184px;
                }
                .firebaseui-flag-MS {
                    background-position: -0px -2198px;
                }
                .firebaseui-flag-MT {
                    background-position: -0px -2212px;
                }
                .firebaseui-flag-MU {
                    background-position: -0px -2226px;
                }
                .firebaseui-flag-MV {
                    background-position: -0px -2240px;
                }
                .firebaseui-flag-MW {
                    background-position: -0px -2254px;
                }
                .firebaseui-flag-MX {
                    background-position: -0px -2268px;
                }
                .firebaseui-flag-MY {
                    background-position: -0px -2282px;
                }
                .firebaseui-flag-MZ {
                    background-position: -0px -2296px;
                }
                .firebaseui-flag-NA {
                    background-position: -0px -2310px;
                }
                .firebaseui-flag-NC {
                    background-position: -0px -2324px;
                }
                .firebaseui-flag-NE {
                    background-position: -0px -2338px;
                }
                .firebaseui-flag-NF {
                    background-position: -0px -2352px;
                }
                .firebaseui-flag-NG {
                    background-position: -0px -2366px;
                }
                .firebaseui-flag-NI {
                    background-position: -0px -2380px;
                }
                .firebaseui-flag-NL {
                    background-position: -0px -2394px;
                }
                .firebaseui-flag-NO {
                    background-position: -0px -2408px;
                }
                .firebaseui-flag-NP {
                    background-position: -0px -2422px;
                }
                .firebaseui-flag-NR {
                    background-position: -0px -2436px;
                }
                .firebaseui-flag-NU {
                    background-position: -0px -2450px;
                }
                .firebaseui-flag-NZ {
                    background-position: -0px -2464px;
                }
                .firebaseui-flag-OM {
                    background-position: -0px -2478px;
                }
                .firebaseui-flag-PA {
                    background-position: -0px -2492px;
                }
                .firebaseui-flag-PE {
                    background-position: -0px -2506px;
                }
                .firebaseui-flag-PF {
                    background-position: -0px -2520px;
                }
                .firebaseui-flag-PG {
                    background-position: -0px -2534px;
                }
                .firebaseui-flag-PH {
                    background-position: -0px -2548px;
                }
                .firebaseui-flag-PK {
                    background-position: -0px -2562px;
                }
                .firebaseui-flag-PL {
                    background-position: -0px -2576px;
                }
                .firebaseui-flag-PM {
                    background-position: -0px -2590px;
                }
                .firebaseui-flag-PN {
                    background-position: -0px -2604px;
                }
                .firebaseui-flag-PR {
                    background-position: -0px -2618px;
                }
                .firebaseui-flag-PS {
                    background-position: -0px -2632px;
                }
                .firebaseui-flag-PT {
                    background-position: -0px -2646px;
                }
                .firebaseui-flag-PW {
                    background-position: -0px -2660px;
                }
                .firebaseui-flag-PY {
                    background-position: -0px -2674px;
                }
                .firebaseui-flag-QA {
                    background-position: -0px -2688px;
                }
                .firebaseui-flag-RE {
                    background-position: -0px -2702px;
                }
                .firebaseui-flag-RO {
                    background-position: -0px -2716px;
                }
                .firebaseui-flag-RS {
                    background-position: -0px -2730px;
                }
                .firebaseui-flag-RU {
                    background-position: -0px -2744px;
                }
                .firebaseui-flag-RW {
                    background-position: -0px -2758px;
                }
                .firebaseui-flag-SA {
                    background-position: -0px -2772px;
                }
                .firebaseui-flag-SB {
                    background-position: -0px -2786px;
                }
                .firebaseui-flag-SC {
                    background-position: -0px -2800px;
                }
                .firebaseui-flag-SD {
                    background-position: -0px -2814px;
                }
                .firebaseui-flag-SE {
                    background-position: -0px -2828px;
                }
                .firebaseui-flag-SG {
                    background-position: -0px -2842px;
                }
                .firebaseui-flag-SH {
                    background-position: -0px -2856px;
                }
                .firebaseui-flag-SI {
                    background-position: -0px -2870px;
                }
                .firebaseui-flag-SJ {
                    background-position: -0px -2884px;
                }
                .firebaseui-flag-SK {
                    background-position: -0px -2898px;
                }
                .firebaseui-flag-SL {
                    background-position: -0px -2912px;
                }
                .firebaseui-flag-SM {
                    background-position: -0px -2926px;
                }
                .firebaseui-flag-SN {
                    background-position: -0px -2940px;
                }
                .firebaseui-flag-SO {
                    background-position: -0px -2954px;
                }
                .firebaseui-flag-SR {
                    background-position: -0px -2968px;
                }
                .firebaseui-flag-SS {
                    background-position: -0px -2982px;
                }
                .firebaseui-flag-ST {
                    background-position: -0px -2996px;
                }
                .firebaseui-flag-SV {
                    background-position: -0px -3010px;
                }
                .firebaseui-flag-SX {
                    background-position: -0px -3024px;
                }
                .firebaseui-flag-SY {
                    background-position: -0px -3038px;
                }
                .firebaseui-flag-SZ {
                    background-position: -0px -3052px;
                }
                .firebaseui-flag-TA {
                    background-position: -0px -3066px;
                }
                .firebaseui-flag-TC {
                    background-position: -0px -3080px;
                }
                .firebaseui-flag-TD {
                    background-position: -0px -3094px;
                }
                .firebaseui-flag-TF {
                    background-position: -0px -3108px;
                }
                .firebaseui-flag-TG {
                    background-position: -0px -3122px;
                }
                .firebaseui-flag-TH {
                    background-position: -0px -3136px;
                }
                .firebaseui-flag-TJ {
                    background-position: -0px -3150px;
                }
                .firebaseui-flag-TK {
                    background-position: -0px -3164px;
                }
                .firebaseui-flag-TL {
                    background-position: -0px -3178px;
                }
                .firebaseui-flag-TM {
                    background-position: -0px -3192px;
                }
                .firebaseui-flag-TN {
                    background-position: -0px -3206px;
                }
                .firebaseui-flag-TO {
                    background-position: -0px -3220px;
                }
                .firebaseui-flag-TR {
                    background-position: -0px -3234px;
                }
                .firebaseui-flag-TT {
                    background-position: -0px -3248px;
                }
                .firebaseui-flag-TV {
                    background-position: -0px -3262px;
                }
                .firebaseui-flag-TW {
                    background-position: -0px -3276px;
                }
                .firebaseui-flag-TZ {
                    background-position: -0px -3290px;
                }
                .firebaseui-flag-UA {
                    background-position: -0px -3304px;
                }
                .firebaseui-flag-UG {
                    background-position: -0px -3318px;
                }
                .firebaseui-flag-UM {
                    background-position: -0px -3332px;
                }
                .firebaseui-flag-UN {
                    background-position: -0px -3346px;
                }
                .firebaseui-flag-US {
                    background-position: -0px -3360px;
                }
                .firebaseui-flag-UY {
                    background-position: -0px -3374px;
                }
                .firebaseui-flag-UZ {
                    background-position: -0px -3388px;
                }
                .firebaseui-flag-VA {
                    background-position: -0px -3402px;
                }
                .firebaseui-flag-VC {
                    background-position: -0px -3416px;
                }
                .firebaseui-flag-VE {
                    background-position: -0px -3430px;
                }
                .firebaseui-flag-VG {
                    background-position: -0px -3444px;
                }
                .firebaseui-flag-VI {
                    background-position: -0px -3458px;
                }
                .firebaseui-flag-VN {
                    background-position: -0px -3472px;
                }
                .firebaseui-flag-VU {
                    background-position: -0px -3486px;
                }
                .firebaseui-flag-WF {
                    background-position: -0px -3500px;
                }
                .firebaseui-flag-WS {
                    background-position: -0px -3514px;
                }
                .firebaseui-flag-XK {
                    background-position: -0px -3528px;
                }
                .firebaseui-flag-YE {
                    background-position: -0px -3542px;
                }
                .firebaseui-flag-YT {
                    background-position: -0px -3556px;
                }
                .firebaseui-flag-ZA {
                    background-position: -0px -3570px;
                }
                .firebaseui-flag-ZM {
                    background-position: -0px -3584px;
                }
                .firebaseui-flag-ZW {
                    background-position: -0px -3598px;
                }
            `}
        </style>
    );
};
