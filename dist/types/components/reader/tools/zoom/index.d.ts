import { ReaderActionInterface } from "../..";
import { UpdateViewInterface } from "../../../..";
import { ZoomInterface } from "../../types";
export declare class Zoom implements ZoomInterface {
    private _reader;
    private _currentPercentage;
    private _intervalId;
    constructor(_reader: ReaderActionInterface & UpdateViewInterface<any>);
    prcentageRestore: (num: number) => number;
    calcPercentage: (num: number) => number;
    getNode: () => import("../../../../snabbdom").VNode;
}
