import mixpanel from "mixpanel-browser";
// TODO; do I disabel access code? I'll leave it in here, so I know how I can track
// access codes in mixpanel. I should remove before shipping
import { getAccessCode } from "./getAccessCode";

export const mixpanelTrack = (desc, trackProps = {}) => {
    const accessCode = getAccessCode();
    if (accessCode != null) {
        trackProps["accessCode"] = accessCode;
    }
    mixpanel.track(desc, trackProps);
};
