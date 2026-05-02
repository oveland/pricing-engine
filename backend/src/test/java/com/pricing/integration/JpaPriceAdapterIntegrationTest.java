package com.pricing.integration;

import static org.assertj.core.api.Assertions.assertThat;

import com.pricing.domain.model.BrandId;
import com.pricing.domain.model.Price;
import com.pricing.domain.model.ProductId;
import com.pricing.infrastructure.adapter.output.jpa.JpaPriceAdapter;
import com.pricing.infrastructure.adapter.output.jpa.SpringDataJpaRepository;
import com.pricing.infrastructure.mapper.PriceMapper;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

@DataJpaTest
@Import({JpaPriceAdapter.class, PriceMapper.class})
class JpaPriceAdapterIntegrationTest {
    @Autowired
    private JpaPriceAdapter jpaPriceAdapter;

    @Autowired
    private SpringDataJpaRepository springDataJpaRepository;

    private static final BrandId BRAND_ZARA = new BrandId(1L);
    private static final ProductId PRODUCT_35455 = new ProductId(35455L);

    @Nested
    @DisplayName("Flyway migrations")
    class FlywayMigrations {
        @Test
        @DisplayName("should create PRICES table and load 4 sample records")
        void shouldLoadFourSampleRecords() {
            long count = springDataJpaRepository.count();
            assertThat(count).isEqualTo(4);
        }
    }

    @Nested
    @DisplayName("JPQL query — findByBrandIdAndProductIdAndDate")
    class JpqlQuery {
        @Test
        @DisplayName("2020-06-14T10:00 → 1 result (price list 1, base tariff)")
        void shouldReturnOnePriceAt10OnJune14() {
            LocalDateTime date = LocalDateTime.of(2020, 6, 14, 10, 0);

            List<Price> prices = jpaPriceAdapter.findByBrandIdAndProductIdAndDate(BRAND_ZARA, PRODUCT_35455, date);

            assertThat(prices).hasSize(1);
            assertThat(prices.get(0).getPriceList()).isEqualTo(1);
        }

        @Test
        @DisplayName("2020-06-14T16:00 → 2 results (price lists 1 and 2, overlapping ranges)")
        void shouldReturnTwoPricesAt16OnJune14() {
            LocalDateTime date = LocalDateTime.of(2020, 6, 14, 16, 0);

            List<Price> prices = jpaPriceAdapter.findByBrandIdAndProductIdAndDate(BRAND_ZARA, PRODUCT_35455, date);

            assertThat(prices).hasSize(2);
            assertThat(prices).extracting(Price::getPriceList).containsExactlyInAnyOrder(1, 2);
        }

        @Test
        @DisplayName("2020-06-15T10:00 → 2 results (price lists 1 and 3)")
        void shouldReturnTwoPricesAt10OnJune15() {
            LocalDateTime date = LocalDateTime.of(2020, 6, 15, 10, 0);

            List<Price> prices = jpaPriceAdapter.findByBrandIdAndProductIdAndDate(BRAND_ZARA, PRODUCT_35455, date);

            assertThat(prices).hasSize(2);
            assertThat(prices).extracting(Price::getPriceList).containsExactlyInAnyOrder(1, 3);
        }

        @Test
        @DisplayName("date with no matches → empty list")
        void shouldReturnEmptyListWhenNoMatches() {
            LocalDateTime date = LocalDateTime.of(2019, 1, 1, 0, 0);

            List<Price> prices = jpaPriceAdapter.findByBrandIdAndProductIdAndDate(BRAND_ZARA, PRODUCT_35455, date);

            assertThat(prices).isEmpty();
        }
    }

    @Nested
    @DisplayName("PriceMapper — entity to domain conversion")
    class MapperConversion {
        @Test
        @DisplayName("should correctly map entity fields to domain Value Objects")
        void shouldMapEntityToDomainCorrectly() {
            LocalDateTime date = LocalDateTime.of(2020, 6, 14, 10, 0);

            List<Price> prices = jpaPriceAdapter.findByBrandIdAndProductIdAndDate(BRAND_ZARA, PRODUCT_35455, date);

            assertThat(prices).hasSize(1);
            Price price = prices.get(0);
            assertThat(price.getBrandId()).isEqualTo(BRAND_ZARA);
            assertThat(price.getProductId()).isEqualTo(PRODUCT_35455);
            assertThat(price.getPriceList()).isEqualTo(1);
            assertThat(price.getPriority()).isZero();
            assertThat(price.getMoney().amount()).isEqualByComparingTo(new BigDecimal("35.50"));
            assertThat(price.getMoney().currency()).isEqualTo("EUR");
            assertThat(price.getDateRange().startDate()).isEqualTo(LocalDateTime.of(2020, 6, 14, 0, 0));
            assertThat(price.getDateRange().endDate()).isEqualTo(LocalDateTime.of(2020, 12, 31, 23, 59, 59));
        }
    }
}
