import { IInputs, IOutputs } from "./generated/ManifestTypes";
import SMCLottiePlayerComponent, { ISMCLottiePlayerComponentProps } from "./SMCLottiePlayerComponent";
import * as React from "react";

export class SMCLottiePlayer implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private _component: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private _notifyOutputChanged: () => void;
    private _context: ComponentFramework.Context<IInputs>;

    /**
     * Empty constructor.
     */
    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this._notifyOutputChanged = notifyOutputChanged;
        this._context = context;
        this._context.mode.trackContainerResize(true);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const props: ISMCLottiePlayerComponentProps = {
            onEventChange: this.onPlayerEvent,
            width: this._context.mode.allocatedWidth,
            height: this._context.mode.allocatedHeight,
            speed: context.parameters.Speed.raw || 1,
            loop: context.parameters.Loop.raw || false,
            autoPlay: context.parameters.Autoplay.raw || false,
            src: context.parameters.Source.raw || "",
            controls: context.parameters.Controls.raw || false,
            background: context.parameters.Background.raw || "transparent",
            state: context.parameters.State.raw || "stopped",
            keepLastFrame: context.parameters.KeepLastFrame.raw || false,
        };
        return React.createElement(SMCLottiePlayerComponent, props);
    }

    onPlayerEvent = (event: string) => {
        switch (event.toLocaleLowerCase()) {
            case "complete":
                this._context.parameters.State.raw = "Stopped";
                this._notifyOutputChanged();
                break;
            case "play":
                this._context.parameters.State.raw = "Playing";
                this._notifyOutputChanged();
                break;
            case "stop":
                this._context.parameters.State.raw = "Stopped";
                this._notifyOutputChanged();
                break;
            case "error":
                this._context.parameters.State.raw = "Error";
                this._notifyOutputChanged(); 
                break;
            case "loop":
                this._context.parameters.State.raw = "Playing";
                this._notifyOutputChanged();  
                break;
            case "pause":
                this._context.parameters.State.raw = "Paused";
                this._notifyOutputChanged();  
                break; 
            default:
                console.log(`onPlayerEvent:unknown event ${event}`)  
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {
            State: this._context.parameters.State.raw as string,
         };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
