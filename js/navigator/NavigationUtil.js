export default class NavigationUtil {

    /**
     * 跳转到首页
     * @param params
     */
    static resetToHomePage(params) {
        const {navigation} = params;
        navigation.navigate('HomePage');
    }

    /**
     * 跳转到指定页面
     * @param params 参数
     * @param page 路由名
     */
    static goPage(params, page) {
        const navigation = NavigationUtil.navigation;
        if (!navigation) {
            console.log('NavigationUtil.navigation can not be null');
            return;
        }
        navigation.navigate(
            page,
            {
                ...params
            }
        );
    }
}
