import { Injectable, Inject, Renderer2, RendererFactory2 } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from "@angular/material/dialog";
import { ComponentType } from "@angular/cdk/portal";

import { AlertDialogComponent } from "./alert-dialog/alert-dialog.component";
import { PromptDialogComponent } from "./prompt-dialog/prompt-dialog.component";
import { DragDrop, DragRef } from "@angular/cdk/drag-drop";
import { DOCUMENT } from "@angular/common";
import { Subject } from "rxjs";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
export interface IDialogConfig extends MatDialogConfig {
  title?: string;
  message: string;
}

export interface IAlertConfig extends IDialogConfig {
  closeButton?: string;
}

export interface IConfirmConfig extends IDialogConfig {
  acceptButton?: string;
  cancelButton?: string;
  isDestructive?: boolean;
}

export interface IPromptConfig extends IConfirmConfig {
  value?: string;
}

export interface IDraggableConfig<T> {
  component: ComponentType<T>;
  config?: MatDialogConfig;
  // CSS selectors of element(s) inside the component meant to be drag handle(s)
  dragHandleSelectors?: string[];
  // Class that will be added to the component signifying drag-ability
  draggableClass?: string;
}

export interface IDraggableRefs<T> {
  matDialogRef: MatDialogRef<T>;
  dragRefSubject: Subject<DragRef>;
}

@Injectable()
export class D2UDialogService {
  private _renderer2: Renderer2;

  constructor(
    @Inject(DOCUMENT) private _document: any,
    private _dialogService: MatDialog,
    private _dragDrop: DragDrop,
    private rendererFactory: RendererFactory2
  ) {
    this._renderer2 = rendererFactory.createRenderer(undefined, null);
  }

  /**
   * params:
   * - component: ComponentType<T>
   * - config: MatDialogConfig
   * Wrapper function over the open() method in MatDialog.
   * Opens a modal dialog containing the given component.
   */
  public open<T>(
    component: ComponentType<T>,
    config?: MatDialogConfig
  ): MatDialogRef<T> {
    return this._dialogService.open(component, config);
  }

  /**
   * Wrapper function over the closeAll() method in MatDialog.
   * Closes all of the currently-open dialogs.
   */
  public closeAll(): void {
    this._dialogService.closeAll();
  }

  /**
   * params:
   * - config: IAlertConfig {
   *     message: string;
   *     title?: string;
   *     viewContainerRef?: ViewContainerRef;
   *     closeButton?: string;
   * }
   *
   * Opens an alert dialog with the provided config.
   * Returns an MatDialogRef<D2UAlertDialogComponent> object.
   */
  public openAlert(
    config: IAlertConfig
  ): MatDialogRef<AlertDialogComponent> {
    const dialogConfig: MatDialogConfig = this._createConfig(config);
    const dialogRef: MatDialogRef<AlertDialogComponent> =
      this._dialogService.open(AlertDialogComponent, dialogConfig);
    const alertDialogComponent: AlertDialogComponent =
      dialogRef.componentInstance;
    alertDialogComponent.title = config.title;
    alertDialogComponent.message = config.message;
    if (config.closeButton) {
      alertDialogComponent.closeButton = config.closeButton;
    }
    return dialogRef;
  }

  /**
   * params:
   * - config: IConfirmConfig {
   *     message: string;
   *     title?: string;
   *     viewContainerRef?: ViewContainerRef;
   *     acceptButton?: string;
   *     cancelButton?: string;
   *     isDestructive?: boolean;
   * }
   *
   * Opens a confirm dialog with the provided config.
   * Returns an MatDialogRef<TdConfirmDialogComponent> object.
   */
  public openConfirm(
    config: IConfirmConfig
  ): MatDialogRef<ConfirmDialogComponent> {
    const dialogConfig: MatDialogConfig = this._createConfig(config);
    const dialogRef: MatDialogRef<ConfirmDialogComponent> =
      this._dialogService.open(ConfirmDialogComponent, dialogConfig);
    const confirmDialogComponent: ConfirmDialogComponent =
      dialogRef.componentInstance;
    confirmDialogComponent.title = config.title;
    confirmDialogComponent.message = config.message;
    if (config.acceptButton) {
      confirmDialogComponent.acceptButton = config.acceptButton;
    }
    if (config.isDestructive) {
      confirmDialogComponent.isDestructive = config.isDestructive;
    }
    if (config.cancelButton) {
      confirmDialogComponent.cancelButton = config.cancelButton;
    }
    return dialogRef;
  }

  /**
   * params:
   * - config: IPromptConfig {
   *     message: string;
   *     title?: string;
   *     value?: string;
   *     viewContainerRef?: ViewContainerRef;
   *     acceptButton?: string;
   *     cancelButton?: string;
   * }
   *
   * Opens a prompt dialog with the provided config.
   * Returns an MatDialogRef<TdPromptDialogComponent> object.
   */
  public openPrompt(
    config: IPromptConfig
  ): MatDialogRef<PromptDialogComponent> {
    const dialogConfig: MatDialogConfig = this._createConfig(config);
    const dialogRef: MatDialogRef<PromptDialogComponent> =
      this._dialogService.open(PromptDialogComponent, dialogConfig);
    const promptDialogComponent: PromptDialogComponent =
      dialogRef.componentInstance;
    promptDialogComponent.title = config.title;
    promptDialogComponent.message = config.message;
    promptDialogComponent.value = config.value;
    if (config.acceptButton) {
      promptDialogComponent.acceptButton = config.acceptButton;
    }
    if (config.cancelButton) {
      promptDialogComponent.cancelButton = config.cancelButton;
    }
    return dialogRef;
  }

  /**
   * Opens a draggable dialog containing the given component.
   */
  public openDraggable<T>({
    component,
    config,
    dragHandleSelectors,
    draggableClass,
  }: IDraggableConfig<T>): IDraggableRefs<T> {
    const matDialogRef: MatDialogRef<T, any> = this._dialogService.open(
      component,
      config
    );
    const dragRefSubject: Subject<DragRef> = new Subject<DragRef>();

    const CDK_OVERLAY_PANE_SELECTOR = ".cdk-overlay-pane";
    const CDK_OVERLAY_CONTAINER_SELECTOR = ".cdk-overlay-container";

    matDialogRef.afterOpened().subscribe(() => {
      const dialogElement: HTMLElement = <HTMLElement>(
        this._document.getElementById(matDialogRef.id)
      );
      const draggableElement: DragRef =
        this._dragDrop.createDrag(dialogElement);

      if (draggableClass) {
        const childComponent = dialogElement.firstElementChild;
        this._renderer2.addClass(childComponent, draggableClass);
      }
      if (dragHandleSelectors && dragHandleSelectors.length) {
        const dragHandles: Element[] = dragHandleSelectors.reduce(
          (acc: Element[], curr: string) => [
            ...acc,
            ...Array.from(dialogElement.querySelectorAll(curr)),
          ],
          []
        );
        if (dragHandles.length > 0) {
          draggableElement.withHandles(<HTMLElement[]>dragHandles);
        }
      }
      const rootElement = dialogElement.closest(CDK_OVERLAY_PANE_SELECTOR);
      if (rootElement) {
        draggableElement.withRootElement(<HTMLElement>rootElement);
      }

      const boundaryElement = dialogElement.closest(
        CDK_OVERLAY_CONTAINER_SELECTOR
      );
      if (boundaryElement) {
        draggableElement.withBoundaryElement(<HTMLElement>boundaryElement);
      }
      dragRefSubject.next(draggableElement);
    });

    return { matDialogRef, dragRefSubject };
  }

  private _createConfig(config: IDialogConfig): MatDialogConfig {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.width = "400px";
    Object.assign(dialogConfig, config);
    return dialogConfig;
  }
}
