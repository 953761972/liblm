import { defineFormConfig } from "@lm_fe/service";
import { 丈夫基本信息_config } from "./丈夫基本信息";
import { 体征检查_config } from "./体征检查";
import { 孕产史_config } from "./孕产史";
import { 孕妇基本信息_config } from "./孕妇基本信息";
import { 本次孕产信息_config } from "./本次孕产信息";
import { 转入登记_config } from "./转入登记";
import { 高危管理_config } from "./高危管理";
import { 其他_config } from "./其他";
import { 其他补充信息_config } from "./其他补充信息";



export default defineFormConfig(
    [
        孕妇基本信息_config(),
        丈夫基本信息_config(),
        本次孕产信息_config(),
        孕产史_config(),
        高危管理_config(),
        体征检查_config(),
        转入登记_config(),
        其他补充信息_config(),
        其他_config(),
    ]
)
