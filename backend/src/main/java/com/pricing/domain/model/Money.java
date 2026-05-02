package com.pricing.domain.model;

import java.math.BigDecimal;
import java.util.Objects;

public record Money(BigDecimal amount, String currency) {

    private static final int ISO_4217_LENGTH = 3;

    public Money {
        Objects.requireNonNull(amount, "amount must not be null");
        Objects.requireNonNull(currency, "currency must not be null");
        if (amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("amount must not be negative");
        }
        if (currency.length() != ISO_4217_LENGTH) {
            throw new IllegalArgumentException("currency must be ISO 4217 (3 characters)");
        }
    }
}
