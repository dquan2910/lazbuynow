function Change()
{
    var productLink = document.getElementById("productLink").value;
    if(productLink == "")
    {
        document.getElementById("thongbaoLink").innerHTML = "Vui lòng điền link.";
    }
    if(productLink.includes("lazada.vn/products/") || productLink.includes("lazada.vn/i"))
    {
        var posOfTemp = productLink.indexOf(".html");
        if(posOfTemp == -1)
            document.getElementById("thongbaoLink").innerHTML = "Link chưa hợp lý";
        ToBuyNowLink(productLink);
    }
    else if(productLink.includes("s.lazada.vn") || productLink.includes("c.lazada.vn"))
    {
        FetchLink(productLink);
    }
    else if(productLink.includes("https://www.lazada.vn/wow/gcp"))
        ChangeQty(productLink);
    else
        document.getElementById("thongbaoLink").innerHTML = "Link chưa hợp lý";

}
function ToBuyNowLink(productLink)
{
    document.getElementById("thongbaoLink").innerHTML = "";
    var posOfTemp = productLink.indexOf(".html");
    productLink = productLink.substring(0, posOfTemp);
    var posOfSKUId = productLink.lastIndexOf("-s") + 2;
    if(posOfSKUId == 1) document.getElementById("thongbaoLink").innerHTML = "Link thiếu skuID. Thử lại link khác";
    else
    {
        var SKUId = productLink.substring(posOfSKUId);
        var qtyraw = document.getElementById("quantity").value;
        let qty = 1;
        if(qtyraw != "")
            qty = parseInt(qtyraw, 10);
        if(qty < 1)
            qty = 1;
        var itemId = productLink.substring(productLink.lastIndexOf("i") + 1, posOfSKUId - 2);
        var finalLink = "https://www.lazada.vn/wow/gcp/vn/trade/shipping?spm=a2o4n.pdp_revamp.main_page.bottom_bar_main_button&buyParams=%7B%22items%22%3A%5B%7B%22itemId%22%3A%22" + itemId + "%22%2C%22skuId%22%3A%22" + SKUId + "%22%2C%22quantity%22%3A"+ qty + "%2C%22attributes%22%3Anull%7D%5D%7D&from_pdp_buy_now=1&pwa_true_login=1";
        document.getElementById("finalLink").value = finalLink;
        document.getElementById("hrefLink").setAttribute("href", finalLink);
        document.getElementById("thongbaoLink").innerHTML = `Thành công. item: ${itemId} - sku: ${SKUId} - SL: ${qty}`;
    }
}

function FetchLink(productLink)
{
    const proxy = "https://cosr-proxy.dongquanmaingoc2910.workers.dev/?url=" + encodeURIComponent(productLink);
    document.getElementById("thongbaoLink").innerHTML = "Đang chuyển đổi....";
    fetch(proxy)
    .then(r => r.json())
    .then(data => {
        var newLink = data.longUrl;
        if(newLink == productLink)
            document.getElementById("thongbaoLink").innerHTML = "Link sai. Vui lòng kiểm tra lại"
        else ToBuyNowLink(newLink);
  }).catch(err => document.getElementById("thongbaoLink").innerHTML = "Vui lòng dùng tạm link dài");

}

function ChangeQty(productLink)
{
    if(productLink.includes("itemId%22%3A%") && productLink.includes("skuId%22%3A%") && productLink.includes("quantity%22%3A"))
    {
        var oldQtyPos =  productLink.indexOf("quantity%22%3A") + 14;
        var oldQty = productLink.substring(oldQtyPos, productLink.indexOf("%2C%22attributes"));
        var linktoQty = productLink.substring(0, oldQtyPos);
        var qtyraw = document.getElementById("quantity").value;
        let qty = 1;
        if(qtyraw != "")
        qty = parseInt(qtyraw, 10);
        if(qty < 1)
        qty = 1;
        var finalLink = linktoQty + qty + "%2C%22attributes%22%3Anull%7D%5D%7D&from_pdp_buy_now=1&pwa_true_login=1";
        document.getElementById("finalLink").value = finalLink;
        document.getElementById("hrefLink").setAttribute("href", finalLink);
        document.getElementById("thongbaoLink").innerHTML = `Thành công. SL: ${oldQty} -> ${qty}`;
    }
    else
        document.getElementById("thongbaoLink").innerHTML = "Link buy now sai, thử lại link khác";
}

function CopyLink()
{
    let textarea = document.getElementById("finalLink");
    if(textarea.value == "")
    {
        document.getElementById("thongbaoLink").innerHTML = "Chưa có link, không thể copy";
    }
    else
    {
        textarea.select();
        document.execCommand("copy");
        document.getElementById("thongbaoLink").innerHTML = "Đã copy!!!";
    }
}
function Reset()
{
    document.getElementById("productLink").value = "";
    document.getElementById("finalLink").value = "";
    document.getElementById("hrefLink").href = "#";
    document.getElementById("thongbaoLink").innerHTML = "";
}
