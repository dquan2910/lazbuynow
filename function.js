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

function ResetV2()
{
    document.getElementById("finalLink").value = "";
    document.getElementById("hrefLink").href = "#";
    document.getElementById("thongbaoLink").innerHTML = "";
    let table = document.getElementById("myTable");
    while (table.rows.length > 2)
        table.deleteRow(-1);
    let inputs = table.getElementsByTagName("input");
    let textarea = table.getElementsByTagName("textarea");
    for (let i = 0; i < inputs.length; i++)
    {
        inputs[i].value = "";
        textarea[i].value = "";
    }
}

async function ChangeV2()
{
    document.getElementById("thongbaoLink").innerHTML = "Đang chuyển đổi....";
    let table = document.getElementById("myTable");
    var thongbao = "";
    var thongbaoLinkChanged = "";
    var finalLink = "https://www.lazada.vn/wow/gcp/vn/trade/shipping?spm=a2o4n.pdp_revamp.main_page.bottom_bar_main_button&buyParams=%7B%22items%22%3A%5B";
    for (let i = 1; i < table.rows.length; i++)
    {
        let row = table.rows[i];
        let link = row.cells[1].querySelector("textarea").value.trim();
        var linkChanged = await ChangeLink(link);
        if(linkChanged.indexOf("itemId") == -1)
        {
            thongbao = thongbao + `Link ${i}: ${linkChanged}<br>`;
        }
        else
        {
            var qtyraw = row.cells[2].querySelector("input").value.trim();
            let qty = 1;
            if(qtyraw != "")
            qty = parseInt(qtyraw, 10);
            if(qty < 1)
            qty = 1;
            linkChanged = linkChanged + qty + "%2C%22attributes%22%3Anull%7D";
            if(finalLink.indexOf("itemId") != -1) // đã có
                finalLink = finalLink + "%2C";
            finalLink = finalLink + linkChanged;
            if(thongbaoLinkChanged != "")
                thongbaoLinkChanged = thongbaoLinkChanged + ", ";
            thongbaoLinkChanged = thongbaoLinkChanged + `Link ${i} - SL: ${qty}`
        }
    }
    if(finalLink.indexOf("itemId") == -1)
        document.getElementById("thongbaoLink").innerHTML = "Tất cả link đều lỗi";
    else
    {
        finalLink = finalLink + "%5D%7D&from_pdp_buy_now=1&pwa_true_login=1";
        document.getElementById("finalLink").value = finalLink;
        document.getElementById("hrefLink").setAttribute("href", finalLink);
        thongbao = thongbao + `Chuyển đổi thành công ${thongbaoLinkChanged}`;
        document.getElementById("thongbaoLink").innerHTML = thongbao;
    }
}
async function ChangeLink(productLink)
{
    if(productLink == "")
    {
        return await "Link trống";
    }
    if(productLink.includes("lazada.vn/products/") || productLink.includes("lazada.vn/i"))
    {
        var posOfTemp = productLink.indexOf(".html");
        if(posOfTemp == -1)
            return await "Link chưa hợp lý";
        return await ToBuyNowLinkV2(productLink);
    }
    else if(productLink.includes("s.lazada.vn") || productLink.includes("c.lazada.vn"))
    {
        return await FetchLinkV2(productLink);
    }
    else
        return await "Link chưa hợp lý";
    
}
async function ToBuyNowLinkV2(productLink)
{
    var posOfTemp = productLink.indexOf(".html");
    productLink = productLink.substring(0, posOfTemp);
    var posOfSKUId = productLink.lastIndexOf("-s") + 2;
    if(posOfSKUId == 1) return await "Link thiếu skuID";
    else
    {
        var SKUId = productLink.substring(posOfSKUId);
        var itemId = productLink.substring(productLink.lastIndexOf("i") + 1, posOfSKUId - 2);
        return await "%7B%22itemId%22%3A%22" + itemId + "%22%2C%22skuId%22%3A%22" + SKUId + "%22%2C%22quantity%22%3A";
    }
}
async function FetchLinkV2(productLink)
{
    try
    {
        const proxy = "https://cosr-proxy.dongquanmaingoc2910.workers.dev/?url=" + encodeURIComponent(productLink);
        const res = await fetchWithTimeout(proxy, {}, 10000);
        if (!res.ok) throw new Error("Bad HTTP status " + res.status);
        const data = await res.json().catch(() => ({}));
        const longLink = data?.longUrl;
        if (!longLink || longLink === productLink) return "Link sai. Vui lòng kiểm tra lại";
        else return ToBuyNowLinkV2(longLink);
    }
    catch(e)
    {
        return "Vui lòng dùng tạm link dài";
    }
}
function fetchWithTimeout(url, opts = {}, ms = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...opts, signal: controller.signal })
    .finally(() => clearTimeout(id));
}