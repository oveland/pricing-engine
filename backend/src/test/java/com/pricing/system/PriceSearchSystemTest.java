package com.pricing.system;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("System Tests — Price Search Endpoint (5 mandatory scenarios)")
class PriceSearchSystemTest {
    @Autowired
    private MockMvc mockMvc;

    private static final String ENDPOINT = "/api/prices";
    private static final long PRODUCT_ID = 35455L;
    private static final long BRAND_ID = 1L;

    @Test
    @DisplayName("Scenario 1: GET at 10:00 on June 14, 2020 → Price_List 1, 35.50 EUR")
    void scenario1_at10OnJune14_shouldReturnPriceList1() throws Exception {
        mockMvc.perform(get(ENDPOINT)
                        .param("date", "2020-06-14T10:00:00")
                        .param("productId", String.valueOf(PRODUCT_ID))
                        .param("brandId", String.valueOf(BRAND_ID))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.productId").value(PRODUCT_ID))
                .andExpect(jsonPath("$.brandId").value(BRAND_ID))
                .andExpect(jsonPath("$.priceList").value(1))
                .andExpect(jsonPath("$.startDate").value("2020-06-14T00:00:00"))
                .andExpect(jsonPath("$.endDate").value("2020-12-31T23:59:59"))
                .andExpect(jsonPath("$.price").value(35.50))
                .andExpect(jsonPath("$.currency").value("EUR"));
    }

    @Test
    @DisplayName("Scenario 2: GET at 16:00 on June 14, 2020 → Price_List 2, 25.45 EUR")
    void scenario2_at16OnJune14_shouldReturnPriceList2() throws Exception {
        mockMvc.perform(get(ENDPOINT)
                        .param("date", "2020-06-14T16:00:00")
                        .param("productId", String.valueOf(PRODUCT_ID))
                        .param("brandId", String.valueOf(BRAND_ID))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.productId").value(PRODUCT_ID))
                .andExpect(jsonPath("$.brandId").value(BRAND_ID))
                .andExpect(jsonPath("$.priceList").value(2))
                .andExpect(jsonPath("$.startDate").value("2020-06-14T15:00:00"))
                .andExpect(jsonPath("$.endDate").value("2020-06-14T18:30:00"))
                .andExpect(jsonPath("$.price").value(25.45))
                .andExpect(jsonPath("$.currency").value("EUR"));
    }

    @Test
    @DisplayName("Scenario 3: GET at 21:00 on June 14, 2020 → Price_List 1, 35.50 EUR")
    void scenario3_at21OnJune14_shouldReturnPriceList1() throws Exception {
        mockMvc.perform(get(ENDPOINT)
                        .param("date", "2020-06-14T21:00:00")
                        .param("productId", String.valueOf(PRODUCT_ID))
                        .param("brandId", String.valueOf(BRAND_ID))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.productId").value(PRODUCT_ID))
                .andExpect(jsonPath("$.brandId").value(BRAND_ID))
                .andExpect(jsonPath("$.priceList").value(1))
                .andExpect(jsonPath("$.startDate").value("2020-06-14T00:00:00"))
                .andExpect(jsonPath("$.endDate").value("2020-12-31T23:59:59"))
                .andExpect(jsonPath("$.price").value(35.50))
                .andExpect(jsonPath("$.currency").value("EUR"));
    }

    @Test
    @DisplayName("Scenario 4: GET at 10:00 on June 15, 2020 → Price_List 3, 30.50 EUR")
    void scenario4_at10OnJune15_shouldReturnPriceList3() throws Exception {
        mockMvc.perform(get(ENDPOINT)
                        .param("date", "2020-06-15T10:00:00")
                        .param("productId", String.valueOf(PRODUCT_ID))
                        .param("brandId", String.valueOf(BRAND_ID))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.productId").value(PRODUCT_ID))
                .andExpect(jsonPath("$.brandId").value(BRAND_ID))
                .andExpect(jsonPath("$.priceList").value(3))
                .andExpect(jsonPath("$.startDate").value("2020-06-15T00:00:00"))
                .andExpect(jsonPath("$.endDate").value("2020-06-15T11:00:00"))
                .andExpect(jsonPath("$.price").value(30.50))
                .andExpect(jsonPath("$.currency").value("EUR"));
    }

    @Test
    @DisplayName("Scenario 5: GET at 21:00 on June 16, 2020 → Price_List 4, 38.95 EUR")
    void scenario5_at21OnJune16_shouldReturnPriceList4() throws Exception {
        mockMvc.perform(get(ENDPOINT)
                        .param("date", "2020-06-16T21:00:00")
                        .param("productId", String.valueOf(PRODUCT_ID))
                        .param("brandId", String.valueOf(BRAND_ID))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.productId").value(PRODUCT_ID))
                .andExpect(jsonPath("$.brandId").value(BRAND_ID))
                .andExpect(jsonPath("$.priceList").value(4))
                .andExpect(jsonPath("$.startDate").value("2020-06-15T16:00:00"))
                .andExpect(jsonPath("$.endDate").value("2020-12-31T23:59:59"))
                .andExpect(jsonPath("$.price").value(38.95))
                .andExpect(jsonPath("$.currency").value("EUR"));
    }
}
