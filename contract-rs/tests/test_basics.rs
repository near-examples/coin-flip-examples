use near_api::types::{AccountId, NearToken};
use serde_json::json;

#[tokio::test]
async fn test_contract_is_operational() -> testresult::TestResult<()> {
    // Initialize the sandbox
    let sandbox = near_sandbox::Sandbox::start_sandbox().await?;
    let sandbox_network =
        near_api::NetworkConfig::from_rpc_url("sandbox", sandbox.rpc_addr.parse()?);

    // Build the contract
    let contract_wasm_path = cargo_near_build::build_with_cli(Default::default())?;
    let contract_wasm = std::fs::read(contract_wasm_path)?;

    // Create accounts
    let alice = create_subaccount(&sandbox, "alice.sandbox").await?;
    let contract = create_subaccount(&sandbox, "coinflip.sandbox")
        .await?
        .as_contract();

    // Initialize signer for the contract deployment
    let signer = near_api::Signer::from_secret_key(
        near_sandbox::config::DEFAULT_GENESIS_ACCOUNT_PRIVATE_KEY
            .parse()
            .unwrap(),
    )?;

    // Deploy the contract
    near_api::Contract::deploy(contract.account_id().clone())
        .use_code(contract_wasm)
        .without_init_call()
        .with_signer(signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    // By default the user has no points
    let points: u8 = contract
        .call_function("points_of", json!({ "player": alice.account_id() }))
        .read_only()
        .fetch_from(&sandbox_network)
        .await?
        .data;
    assert_eq!(points, 0);

    // The points are correctly computed
    let mut tails_counter = 0;
    let mut heads_counter = 0;
    let mut expected_points: u8 = 0;

    for _ in 0..10 {
        let outcome: String = contract
            .call_function("flip_coin", json!({ "player_guess": "tails" }))
            .transaction()
            .with_signer(alice.account_id().clone(), signer.clone())
            .send_to(&sandbox_network)
            .await?
            .assert_success()
            .json()?;

        if outcome == "tails" {
            tails_counter += 1;
            expected_points += 1;
        } else {
            heads_counter += 1;
            expected_points = expected_points.saturating_sub(1);
        }
    }

    // A binomial(10, 1/2) has P(x < 2) ~ 1%
    assert!(heads_counter >= 2);
    assert!(tails_counter >= 2);

    let points: u8 = contract
        .call_function("points_of", json!({ "player": alice.account_id() }))
        .read_only()
        .fetch_from(&sandbox_network)
        .await?
        .data;
    assert_eq!(points, expected_points);

    Ok(())
}

async fn create_subaccount(
    sandbox: &near_sandbox::Sandbox,
    name: &str,
) -> testresult::TestResult<near_api::Account> {
    let account_id: AccountId = name.parse().unwrap();
    sandbox
        .create_account(account_id.clone())
        .initial_balance(NearToken::from_near(10))
        .send()
        .await?;
    Ok(near_api::Account(account_id))
}
