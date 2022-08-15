'use strict';

{
  const createContainer = () => {
    const container = document.createElement('div');
    container.classList.add('container');
    return container;
  };

  const createLogo = (title) => {
    const h1 = document.createElement('h1');
    h1.textContent = `Телефонный справочник ${title}`;
    return h1;
  };

  const createHeader = () => {
    const header = document.createElement('hearder');
    header.classList.add('header');

    const headerContainer = createContainer();
    header.append(headerContainer);

    header.headerContainer = headerContainer;

    return header;
  };

  const init = (selector, title) => {
    const app = document.querySelector(selector);
    const header = createHeader();
    const logo = createLogo(title);
    header.append(logo);
    app.append(header);
    return app;
  };

  window.phonebookInit = init;
}
