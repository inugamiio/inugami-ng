import {http, HttpResponse} from 'msw'

export const labelhandlers = [

  //====================================================================================================================
  // [GET] /api/label
  //====================================================================================================================
  http.get('/api/label', async ({request}) => {
    const response = await fetch('data/mock/label/api_label.get.json');
    const data     = await response.json();
    return HttpResponse.json(data);
  }),
]
