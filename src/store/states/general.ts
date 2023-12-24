// import { createStore } from "solid-js/store";
// import { Product } from "../../interface/products";
// import { Subscription } from "../../interface/payment";
//
// const defaultDimensions = {
//   width: 0,
//   height: 0,
// };
//
// export const [dimensionsState, setDimensionState] = createStore({
//   footer: defaultDimensions,
//   header: defaultDimensions,
// });
//
// export const [searchProductData, setSearchProductData] = createStore<{
//   data?: {
//     search: string;
//     location?: string;
//   };
// }>({
//   data: undefined,
// });
//
// export const [dashboardElements, setDashboardElements] = createStore<{
//   scrollerRef?: HTMLDivElement;
// }>({
//   scrollerRef: undefined,
// });
//
// export const [productsState, setProductsState] = createStore<{
//   otherProducts: Product[];
//   trendingProducts: Product[];
// }>({
//   otherProducts: [],
//   trendingProducts: [],
// });
//
// export const [staticFetchedData, setStaticFetchedData] = createStore<{
//   subscriptionPlans?: Subscription[];
//   notifications?: Notification[];
// }>({});
