import { assetData } from "./models/assets.js";
import Item from "./models/items.js";
import connect from "./config/database.js";

export const insertAsset = async () => {
  const data = assetData;
  await connect();
  try {
    const formattedData = assetData.map((asset) => ({
      category: asset.Category,
      name: asset.Item,
      depreciationRate: asset.Depreciation_Rate,
      itemCode: asset.ItemCode,
    }));
    console.log(formattedData.length);
    await Item.insertMany(formattedData, { ordered: false });
    console.log("Data inserted");
  } catch (error) {
    console.log(error.message);
  }
};

insertAsset();
