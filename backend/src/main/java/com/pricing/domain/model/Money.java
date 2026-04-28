package com.pricing.domain.model;

import java.math.BigDecimal;

public record Money(BigDecimal amount, String currency) {
}
