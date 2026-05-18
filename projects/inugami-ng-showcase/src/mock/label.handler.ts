import {http, HttpResponse} from 'msw'
const baseHref = document.getElementsByTagName('base')[0]?.getAttribute('href') || '/';

export const labelhandlers = [

  //====================================================================================================================
  // [GET] /api/label
  //====================================================================================================================
  http.get('*/api/label', async ({request}) => {
    const response = await fetch(`${baseHref}data/mock/label/api_label.get.json`.replace(/\/+/g, '/'));
    if (!response.ok) {
      return new HttpResponse('Mock file not found', { status: 404 });
    }
    const data     = await response.json();
    return HttpResponse.json(data);
  }),
]
