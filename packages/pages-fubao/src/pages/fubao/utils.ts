import { useEffect, useState } from "react";
import { IModel_EarlyPregnancySurgicalTemplate, SModel_EarlyPregnancySurgicalTemplate } from "./.stupid_model/models/EarlyPregnancySurgicalTemplate";

export function use_手术模板() {
    const [templates, set_templates] = useState<IModel_EarlyPregnancySurgicalTemplate[]>([]);
    useEffect(() => {
        SModel_EarlyPregnancySurgicalTemplate.getList().then((r) => {
            set_templates(r);
        });
        return () => {

        }
    }, [])

}