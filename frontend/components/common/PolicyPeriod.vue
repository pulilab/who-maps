<template>
	<div :class="`period ${document.expired ? 'expired' : ''}`">
	<div>
    {{ document.validFromDisplay }}
	</div>
	<el-tooltip content="Expired" placement="top" :disabled="!document.expired">
		<div class="until">
      {{ document.valid_until ? document.validUntilDisplay : '...' }}
		</div>
	</el-tooltip>
	</div>
</template>

<script>
export default {
	props: {
		document: {
			type: Object,
			required: true
		}
	}
}
</script>

<style lang="less" scoped>
@import "~assets/style/variables.less";
@import "~assets/style/mixins.less";
.period {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
	width: 80px;
	text-align: center;
	&.expired {
    .until {
      color: @colorDanger;
      font-weight: bold;
    }
	}
}
</style>