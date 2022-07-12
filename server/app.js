const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  allowEIO3: true, // false by default
});

const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://cuantoestaeldolar.pe/"

    
function buscarPrecios(){
  axios.get(url)
  .then(res => {
    const $ = cheerio.load(res.data)
    let casasDeCambio = []
      //get all elements with selector and show their text

      //casas de cambio ---------------------------------------------------------------
    $('[class="wrapper-table tb_dollar"]').each((i, elem) => {
            const title = $(elem).find('[class="td tb_dollar_title"]').text()
            const link = $(elem).find('[class="td btn_ag"] a').attr('href')
            const imgClass = $(elem).find('[class="td tb_dollar_title"] div div h3').attr('class')
            const compra = $(elem).find('[class="td tb_dollar_compra"]').text()
            const venta = $(elem).find('[class="td tb_dollar_venta"]').text()
            //if compra is not empty add to casasDeCambio
            if(compra !== ""){
                casasDeCambio.push({
                    title,
                    compra,
                    link,
                    imgClass,
                    venta
                        })
                    }
                }
        )

    casasDeCambio.forEach(item => {
        item.title = item.title.replace(/\n/g, '')
        item.compra = item.compra.replace(/\n/g, '')
        item.venta = item.venta.replace(/\n/g, '')
        item.imgClass = item.imgClass.replace(/\n/g, '')
        item.link = (new URL(item.link)).origin
        }
    )

        //sort casasDeCambio by highest compra price
    casasDeCambio.sort((a, b) => {
        return b.compra - a.compra
        }
    )

      //Cambio sunat---------------------------------------------------------------
    const cambioSunat = $('[class="td tb_dollar_title tb_dollar_title_"]').first().text().replace(/\n/g, '')
    const cambioSunatCompra = $('[class="td tb_dollar_compra tb_dollar__"]').eq(1).text().replace(/[^0-9.]/g, '')
    const cambioSunatVenta = $('[class="td tb_dollar_venta tb_dollar__"]').eq(1).text().replace(/[^0-9.]/g, '').substring(1)

    const grupoSunat = {
      "title" : cambioSunat,
      "compra" : cambioSunatCompra,
      "venta" :  cambioSunatVenta
    }


      //remove '\n' from objects

    //BANCOS TRADICIONALES ---------------------------------------------------------------

    const selectorBancos = $('[class="wrapper-table tb_dollar t-even tb_hidden-"]')
    const selectorBancos2 = $('[class="wrapper-table tb_dollar t-odd tb_hidden-"]')
        // get all element with selector and show their text
    let bancosTradicionales = []
    selectorBancos.each((i, elem) => {
            const title = $(elem).find('[class="td tb_dollar_title"]').find('img').attr('alt')
            const compra = $(elem).find('[class="td tb_dollar_compra"]').text().replace(/[^0-9.]/g, '')
            const venta = $(elem).find('[class="td tb_dollar_venta"]').text().replace(/[^0-9.]/g, '').substring(1)

        
            //if compra is not empty add to bancosTradicionales
            if(compra !== ""){
                bancosTradicionales.push({
                    title,
                    compra,
                    venta
                        })
                    }
                }
        )

        selectorBancos2.each((i, elem) => {
            const title = $(elem).find('[class="td tb_dollar_title"]').find('img').attr('alt')
            const compra = $(elem).find('[class="td tb_dollar_compra"]').text().replace(/[^0-9.]/g, '')
            const venta = $(elem).find('[class="td tb_dollar_venta"]').text().replace(/[^0-9.]/g, '').substring(1)

        
            //if compra is not empty add to bancosTradicionales
            if(compra !== ""){
                bancosTradicionales.push({
                    title,
                    compra,
                    venta
                        })
                    }
                }
        )

        const allData = [casasDeCambio, grupoSunat, bancosTradicionales]
        //send data to client
        io.emit("fetchData", allData)
        




  }).catch(err => console.error(err))
  
}


io.on("connection", (socket) => {
  console.log("conectado en backend");
  buscarPrecios()
  io.emit("event-frontend");
});

module.exports = {
  app,
  server,
};
