import mixpanel from "mixpanel-browser";
import { getAccessCode } from "./getAccessCode";

export const mixpanelTrack = (desc, trackProps = {}) => {
    const accessCode = getAccessCode();
    if (accessCode != null) {
        trackProps["accessCode"] = accessCode;
    }
    mixpanel.track(desc, trackProps);
};
