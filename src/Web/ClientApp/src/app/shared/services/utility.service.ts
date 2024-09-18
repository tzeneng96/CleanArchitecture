import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { from, fromEvent, Observable, of } from "rxjs";
import { Location } from "@angular/common";
import { concatMap, take } from "rxjs/operators";
import { DataService } from "./data-service";
@Injectable()
export class UtilityService {
  public _router: Router;
  constructor(
    router: Router,
    private dataService: DataService,
    private location: Location,
  ) {
    this._router = router;
  }

  public goBack() {
    this.location.back();
  }

  public convertDateTime(date: Date) {
    const _formattedDate = new Date(date.toString());
    return _formattedDate.toDateString();
  }

  public navigate(path: string) {
    this._router.navigate([path]);
  }

  public navigateToSignIn() {
    this.navigate("/login");
  }

  public getParams() {
    const searchParams = window.location.search.split("?")[1];
    if (searchParams) {
      const paramsObj: any = {};

      searchParams.split("&").forEach((i) => {
        paramsObj[i.split("=")[0]] = i.split("=")[1];
      });
      return paramsObj;
    }
    return undefined;
  }
  public readableColumnName(columnName: string): string {
    // Convert underscores to spaces
    if (
      typeof columnName === "undefined" ||
      columnName === undefined ||
      columnName === null
    ) {
      return columnName;
    }

    if (typeof columnName !== "string") {
      columnName = String(columnName);
    }

    return (
      columnName
        .replace(/_+/g, " ")
        // Replace a completely all-capsed word with a first-letter-capitalized version
        .replace(/^[A-Z]+$/, (match) => {
          return (match.charAt(0).toUpperCase() + match.slice(1)).toLowerCase();
        })
        // Capitalize the first letter of words
        .replace(/([\w\u00C0-\u017F]+)/g, (match) => {
          return match.charAt(0).toUpperCase() + match.slice(1);
        })
        // Put a space in between words that have partial capilizations (i.e. 'firstName' becomes 'First Name')
        // .replace(/([A-Z]|[A-Z]\w+)([A-Z])/g, "$1 $2");
        // .replace(/(\w+?|\w)([A-Z])/g, "$1 $2");
        .replace(/(\w+?(?=[A-Z]))/g, "$1 ")
    );
  }

  public loadStyle(link: string): Observable<any> {
    if (this.isLoadedStyle(link)) {
      return of("");
    } else {
      const head = document.getElementsByTagName("head")[0];
      // Load jquery Ui
      const styleNode = document.createElement("link");
      styleNode.rel = "stylesheet";
      styleNode.type = "text/css";
      styleNode.href = link;
      styleNode.media = "all";
      head.appendChild(styleNode);
      return fromEvent(styleNode, "load");
    }
  }
  public loadScript(script: string): Observable<any> {
    if (this.isLoadedScript(script)) {
      return of("");
    } else {
      const head = document.getElementsByTagName("head")[0];
      // Load jquery Ui
      const scriptNode = document.createElement("script");
      scriptNode.src = script;
      scriptNode.async = false;
      // scriptNode.type = 'text/javascript';
      // scriptNode.charset = 'utf-8';
      head.insertBefore(scriptNode, head.firstChild);
      return fromEvent(scriptNode, "load");
    }
  }
  toQueryParams(obj: any): string {
    return Object.keys(obj)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
      )
      .join("&");
  }

  public fromQueryParams(queryString: string): Object {
    const query: any = {};
    const pairs = (
      queryString[0] === "?" ? queryString.substr(1) : queryString
    ).split("&");
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i].split("=");
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
    }
    return query;
  }

  public formatErrors(errors: any) {
    return errors ? errors.map((err: any) => err.message).join("/n") : "";
  }
  // Detect if library loaded
  private isLoadedScript(lib: string) {
    return document.querySelectorAll('[src="' + lib + '"]').length > 0;
  }

  private isLoadedStyle(lib: string) {
    return document.querySelectorAll('[href="' + lib + '"]').length > 0;
  }


  public downloadFileFromBlob(blob: Blob, fileName: string) {
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display: none");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  public downloadFileFromUrl(url: string, fileName: string) {
    this.dataService.getFile(url).subscribe((response: Blob) => {
      // download file
      this.downloadFileFromBlob(response, fileName);
    });
  }

  printPDFFileFromUrl(url: string) {
    this.dataService.getFile(url).subscribe((response: any) => {
      // download file
      var blob = new Blob([response], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = blobUrl;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
    });
  }

  setDefaultBarcodePrintQuantity(quantity: number) {
    localStorage.setItem("barcodePrintDefaultQty", quantity.toString());
  }

  getDefaultBarcodePrintQuantity(): number {
    let cacheQty = localStorage.getItem("barcodePrintDefaultQty");
    let defaultQuantity = 4;
    if (cacheQty && cacheQty != "") {
      defaultQuantity = Number(cacheQty);
    }
    return defaultQuantity;
  }

  setEnableBarcodeAutoPrint(flag: boolean) {
    localStorage.setItem("barcodeAutoPrintEnable", flag ? "true" : "false");
  }

  getIsEnableBarcodeAutoPrint(): boolean {
    let cache = localStorage.getItem("barcodeAutoPrintEnable");
    if (cache) {
      return cache == "true";
    }
    return false;
  }
}
