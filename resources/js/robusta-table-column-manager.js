import Sortable from "sortablejs";

export default function robustaTableColumnManager({
    data = [],
    fixed = [],
    isLoading = false
} = {}){

    return {
        data,
        fixed,
        isLoading,
        sortable: null,

        init() {
            this.sortable = Sortable.create(this.$refs.sortable, {
                animation: 150,
                dataIdAttr: 'x-sortable-item',
                handle: '.robusta-sortable-handle',
                onSort: () => {
                    const sortedSubset = this.sortable.toArray();

                    if(!Array.isArray(this.data)) return;

                    const result = [];
                    let sortableIndex = 0;

                    for (const item of this.data) {
                        if(this.fixed.includes(item)) {
                            result.push(item);
                        } else {
                            result.push(sortedSubset[sortableIndex]);
                            sortableIndex++;
                        }
                    }

                    this.data.splice(0, this.data.length, ...result);

                    this.$dispatch("sorted", [...this.data]);
                },
            });

            this.$watch("isLoading", (value) => {
                this.sortable.option('disabled', !!value);
            })

            this.sortable.option('disabled', !!this.isLoading);
        },

        destroy() {
            this.sortable?.destroy();
        }
    };
}