use near_workspaces::{types::NearToken, Account, Contract};
use serde_json::json;
 
#[tokio::test]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let worker = near_workspaces::sandbox().await?;
    let contract_wasm = near_workspaces::compile_project("./").await?;
    let contract = worker.dev_deploy(&contract_wasm).await?;
 
    // create accounts
    let account = worker.dev_create_account().await?;
    let alice = account
        .create_subaccount("alice")
        .initial_balance(NearToken::from_near(30))
        .transact()
        .await?
        .into_result()?;
 
    // begin tests
    test_user_has_no_points(&alice, &contract).await?;
    test_points_are_correctly_computed(&alice, &contract).await?;
    Ok(())
}

async fn test_user_has_no_points(
    user: &Account,
    contract: &Contract,
) -> Result<(), Box<dyn std::error::Error>> {
    let points: u8 = user
        .call(contract.id(), "points_of")
        .args_json(json!({ "player": user.id()}))
        .transact()
        .await?
        .json()?;
 
    assert_eq!(points, 0);
    println!("      Passed ✅ test_user_has_no_points");
    Ok(())
}
 
async fn test_points_are_correctly_computed(
    user: &Account,
    contract: &Contract,
) -> Result<(), Box<dyn std::error::Error>> {
    let mut tails_counter = 0;
    let mut heads_counter = 0;
    let mut expected_points = 0;

    let mut i = 0;
    while i < 10 {
        let outcome: String = user.call(contract.id(), "flip_coin")
          .args_json(json!({"player_guess": "tails"}))
          .transact()
          .await?
          .json()?;

        if outcome.eq("tails") {
          tails_counter = tails_counter + 1;
          expected_points = expected_points + 1;
        } else {
          heads_counter = heads_counter + 1;
          if expected_points > 0 {
            expected_points = expected_points - 1;
          }
        }
        i = i + 1;
    }

    assert!(heads_counter >= 2);
    assert!(tails_counter >= 2);
    
    let points: u8 = user
        .call(contract.id(), "points_of")
        .args_json(json!({ "player": user.id()}))
        .transact()
        .await?
        .json()?;
 
    assert_eq!(points, expected_points);
    println!("      Passed ✅ test_points_are_correctly_computed");
    Ok(())
}