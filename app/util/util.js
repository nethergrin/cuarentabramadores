/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function parseQueryString() {
    qs = window.location.search.substring(1);
    pares = qs.split('&');
    params=new Array();
    for(i=0;i<pares.length;i++) {
        par = pares[i].split('=');
        params[par[0]] = par[1];
    }
    return params;
}