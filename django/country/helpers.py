from decimal import Decimal, ROUND_HALF_UP


def round_decimal(value: Decimal) -> Decimal:
    return Decimal(value).quantize(Decimal(".01"), rounding=ROUND_HALF_UP)
