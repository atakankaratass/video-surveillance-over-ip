import { formatStatusMessage } from "../shared/appInfo";

const appElement = document.querySelector<HTMLDivElement>("#app");

if (!appElement) {
  throw new Error("App root element was not found.");
}

appElement.innerHTML = `
  <section>
    <h1>CS 418 Video Surveillance over IP</h1>
    <p>${formatStatusMessage("bootstrap")}</p>
  </section>
`;
